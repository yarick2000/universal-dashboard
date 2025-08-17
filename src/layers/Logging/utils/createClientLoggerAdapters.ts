import { ConsoleLoggingFeature, WorkerLoggingFeature } from '@/layers/Configuration';
import { FeatureService } from '@/layers/Feature';

import { ConsoleLoggerAdapter } from '../adapters/ConsoleLoggerAdapter';
import { WorkerLoggerAdapter } from '../adapters/WorkerLoggerAdapter';
import { Logger } from '../interfaces';
import { LogLevel } from '../types';

import { clientFormatMessage } from './clientFormatMessage';

export default function createClientLoggerAdapters(featureService: FeatureService): Logger[] {

  const adapters: Logger[] = [];

  const consoleLoggingFeature = featureService.getFeature<ConsoleLoggingFeature>('consoleLogging');
  if (consoleLoggingFeature.enabled) {
    const logLevels = consoleLoggingFeature.logLevels || [];
    const console = window.console;
    try {
      const consoleAdapter = new ConsoleLoggerAdapter(
        console,
        logLevels as LogLevel[],
        clientFormatMessage,
      );
      adapters.push(consoleAdapter);
    } catch {
      // TODO: Handle error
    }
  }
  const workerLoggingFeature = featureService.getFeature<WorkerLoggingFeature>('workerLogging');
  if (workerLoggingFeature.enabled) {
    const logLevels = workerLoggingFeature.logLevels || [];
    try {
      // Create a fallback logger for server-side logging errors
      // const fallbackLogger = new ConsoleLoggerAdapter(
      //   window.console,
      //   ['error'],
      //   clientFormatMessage,
      // );
      const workerAdapter = new WorkerLoggerAdapter(
        logLevels as LogLevel[],
        workerLoggingFeature.batchSize,
        workerLoggingFeature.idleTimeSec,
      );
      adapters.push(workerAdapter);
    } catch {
      // TODO: Handle error
    }
  }
  return adapters;
};

