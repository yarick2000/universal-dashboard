import { ClientLoggingFeature } from '@/layers/Configuration';
import { FeatureService } from '@/layers/Feature';

import { ConsoleLoggerAdapter } from '../adapters/ConsoleLoggerAdapter';
import { WorkerLoggerAdapter } from '../adapters/WorkerLoggerAdapter';
import { Logger } from '../interfaces';
import { LogLevel } from '../types';

import { clientFormatMessage } from './clientFormatMessage';

export default function createClientLoggerAdapters(featureService: FeatureService): Logger[] {

  const adapters: Logger[] = [];

  const clientLoggingFeature = featureService.getFeature<ClientLoggingFeature>('clientLogging');
  if (clientLoggingFeature.enabled) {
    const logLevels = clientLoggingFeature.logLevels || [];
    if (clientLoggingFeature.logToConsole) {
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
    if (clientLoggingFeature.logToServer) {
      try {
        // Create a fallback logger for server-side logging errors
        const fallbackLogger = new ConsoleLoggerAdapter(
          window.console,
          ['error'],
          clientFormatMessage,
        );
        const workerAdapter = new WorkerLoggerAdapter(
          fallbackLogger,
          logLevels as LogLevel[],
          clientLoggingFeature.logToServerBatchSize,
          clientLoggingFeature.logToServerIdleTimeSec,
        );
        adapters.push(workerAdapter);
      } catch {
        // TODO: Handle error
      }
    }
  }
  return adapters;
};

