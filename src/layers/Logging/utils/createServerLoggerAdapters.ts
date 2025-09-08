import { Console } from 'console';

import { ConsoleLoggingFeature, FileLoggingFeature, SupabaseLoggingFeature } from '@/layers/Configuration';
import { SupabaseDataClient } from '@/layers/Data';
import { FeatureService } from '@/layers/Feature';

import { ConsoleLoggerAdapter } from '../adapters/ConsoleLoggerAdapter';
import { FileLoggerAdapter } from '../adapters/FileLoggerAdapter';
import { SupabaseLoggerAdapter } from '../adapters/SupabaseLoggerAdapter';
import { LoggerAdapter } from '../interfaces';
import { LogLevel } from '../types';

import { serverFormatMessage } from './serverFormatMessage';

export default function createServerLoggerAdapters(
  supabaseClient: SupabaseDataClient,
  featureService: FeatureService,
): LoggerAdapter[] {
  const adapters: LoggerAdapter[] = [];

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
      const consoleAdapter: LoggerAdapter = new ConsoleLoggerAdapter(
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
    const fallbackLogger = new ConsoleLoggerAdapter(
      console,
      ['error'],
      serverFormatMessage,
    );
    try {
      const fileAdapter: LoggerAdapter = new FileLoggerAdapter(
        logLevels as LogLevel[],
        fileLoggingFeature.filePath,
        fileLoggingFeature.fileNamePattern,
        fileLoggingFeature.batchSize,
        fileLoggingFeature.idleTimeSec,
        fileLoggingFeature.maxStoragePeriodDays,
        fileLoggingFeature.maxFileSize,
        (error) => fallbackLogger.log({
          level: 'error',
          message: 'FileLoggerAdapter initialization error',
          timestamp: Date.now(),
          source: 'server',
          args: error,
        }),
      );
      adapters.push(fileAdapter);
    } catch (error) {
      void fallbackLogger.log({
        level: 'error',
        message: 'FileLoggerAdapter initialization error',
        timestamp: Date.now(),
        source: 'server',
        args: error,
      });
    }
  }
  const supabaseLoggingFeature = featureService.getFeature<SupabaseLoggingFeature>('supabaseLogging');
  if (supabaseLoggingFeature.enabled) {
    const logLevels = supabaseLoggingFeature.logLevels || [];
    const fallbackLogger = new ConsoleLoggerAdapter(
      console,
      ['error'],
      serverFormatMessage,
    );
    try {
      const supabaseAdapter: LoggerAdapter = new SupabaseLoggerAdapter(
        supabaseClient,
        logLevels as LogLevel[],
        supabaseLoggingFeature.batchSize,
        supabaseLoggingFeature.idleTimeSec,
        (error) => fallbackLogger.log({
          level: 'error',
          message: 'SupabaseLoggerAdapter error',
          timestamp: Date.now(),
          source: 'server',
          args: error,
        }),
      );
      adapters.push(supabaseAdapter);
    } catch (error) {
      void fallbackLogger.log({
        level: 'error',
        message: 'SupabaseLoggerAdapter initialization error',
        timestamp: Date.now(),
        source: 'server',
        args: error,
      });
    }
  }
  return adapters;
};
