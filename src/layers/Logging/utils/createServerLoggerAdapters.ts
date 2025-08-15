import { Console } from 'console';

import { ServerLoggingFeature } from '@/layers/Configuration';
import { FeatureService } from '@/layers/Feature';

import { ConsoleLoggerAdapter } from '../adapters/ConsoleLoggerAdapter';
import { FileLoggerAdapter } from '../adapters/FileLoggerAdapter';
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
    if (serverLoggingFeature.logToFile) {
      const fileAdapter: Logger = new FileLoggerAdapter(
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
  }
  return adapters;
}
