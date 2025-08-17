import { Console } from 'console';

import { ConsoleLoggingFeature, FileLoggingFeature, SupabaseLoggingFeature } from '@/layers/Configuration';
import { FeatureService } from '@/layers/Feature';

import { ConsoleLoggerAdapter } from '../adapters/ConsoleLoggerAdapter';
import { FileLoggerAdapter } from '../adapters/FileLoggerAdapter';
import { SupabaseLoggerAdapter } from '../adapters/SupabaseLoggerAdapter';
import { Logger } from '../interfaces';
import { LogLevel } from '../types';

import { serverFormatMessage } from './serverFormatMessage';

export default function createServerLoggerAdapters(featureService: FeatureService): Logger[] {
  const adapters: Logger[] = [];

  const consoleLoggingFeature = featureService.getFeature<ConsoleLoggingFeature>('consoleLogging');
  if (consoleLoggingFeature.enabled) {
    const logLevels = consoleLoggingFeature.logLevels || [];
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
  const fileLoggingFeature = featureService.getFeature<FileLoggingFeature>('fileLogging');
  if (fileLoggingFeature.enabled) {
    const logLevels = fileLoggingFeature.logLevels || [];
    try {
      // const fallbackLogger = new ConsoleLoggerAdapter(
      //   console,
      //   ['error'],
      //   serverFormatMessage,
      // );
      const fileAdapter: Logger = new FileLoggerAdapter(
        logLevels as LogLevel[],
        fileLoggingFeature.filePath,
        fileLoggingFeature.fileNamePattern,
        fileLoggingFeature.batchSize,
        fileLoggingFeature.idleTimeSec,
        fileLoggingFeature.maxStoragePeriodDays,
        fileLoggingFeature.maxFileSize,
      );
      adapters.push(fileAdapter);
    } catch {
      // TODO: Handle error
    }
  }
  const supabaseLoggingFeature = featureService.getFeature<SupabaseLoggingFeature>('supabaseLogging');
  if (supabaseLoggingFeature.enabled) {
    const logLevels = supabaseLoggingFeature.logLevels || [];
    try {
      // const fallbackLogger = new ConsoleLoggerAdapter(
      //   console,
      //   ['error'],
      //   serverFormatMessage,
      // );
      const supabaseAdapter: Logger = new SupabaseLoggerAdapter(
        logLevels as LogLevel[],
        supabaseLoggingFeature.batchSize,
        supabaseLoggingFeature.idleTimeSec,
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_KEY as string,
      );
      adapters.push(supabaseAdapter);
    } catch {
      // TODO: Handle error
    }
  }
  return adapters;
};
