import { Console } from 'console';

import { ServerLoggingFeature } from '@/layers/Configuration';
import { FeatureService } from '@/layers/Feature';

import { ConsoleLoggerAdapter } from '../adapters/ConsoleLoggerAdapter';
import { FileLoggerAdapter } from '../adapters/FileLoggerAdapter';
import { SupabaseLoggerAdapter } from '../adapters/SupabaseLoggerAdapter';
import { Logger } from '../interfaces';
import { LogLevel } from '../types';

import { serverFormatMessage } from './serverFormatMessage';

export default function createServerLoggerAdapters(featureService: FeatureService): Logger[] {
  const adapters: Logger[] = [];

  const serverLoggingFeature = featureService.getFeature<ServerLoggingFeature>('serverLogging');
  if (serverLoggingFeature.enabled) {
    const logLevels = serverLoggingFeature.logLevels || [];
    if (serverLoggingFeature.logToConsole) {
      try {
        const console = new Console({
          stdout: process.stdout,
          stderr: process.stderr,
          colorMode: true,
          groupIndentation: 0,
        });
        const consoleAdapter: Logger = new ConsoleLoggerAdapter(
          console,
          logLevels as LogLevel[],
          serverFormatMessage,
        );
        adapters.push(consoleAdapter);
      } catch {
        // TODO: Handle error
      }
    }
    if (serverLoggingFeature.logToFile && process.env.NODE_ENV === 'development') {
      const fallbackLogger = new ConsoleLoggerAdapter(
        console,
        ['error'],
        serverFormatMessage,
      );
      const fileAdapter: Logger = new FileLoggerAdapter(
        fallbackLogger,
        logLevels as LogLevel[],
        serverLoggingFeature.logToFilePath,
        serverLoggingFeature.logToFileNamePattern,
        serverLoggingFeature.logToFileBatchSize,
        serverLoggingFeature.logToFileIdleTimeSec,
        serverLoggingFeature.logToFileMaxStoragePeriodDays,
        serverLoggingFeature.logToFileMaxFileSize,
      );
      adapters.push(fileAdapter);
    }
    if (serverLoggingFeature.logToSupabase) {
      const fallbackLogger = new ConsoleLoggerAdapter(
        console,
        ['error'],
        serverFormatMessage,
      );
      const supabaseAdapter: Logger = new SupabaseLoggerAdapter(
        fallbackLogger,
        logLevels as LogLevel[],
        serverLoggingFeature.logToSupabaseBatchSize,
        serverLoggingFeature.logToSupabaseIdleTimeSec,
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_KEY as string,
      );
      adapters.push(supabaseAdapter);
    }
  }
  return adapters;
}
