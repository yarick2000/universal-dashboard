import { DI } from '@/enums';
import { ClientLoggingFeature } from '@/layers/Configuration';
import { FeatureService } from '@/layers/Feature';
import { isClient } from '@/utils';

import { ClientConsoleLoggerAdapter } from '../adapters/ClientConsoleLoggerAdapter';
import { ClientWorkerLoggerAdapter } from '../adapters/ClientWorkerLoggerAdapter';
import { Logger } from '../interfaces';
import { LogLevel } from '../types';

export function createLoggerAdapters(featureService: FeatureService): Logger[] {
  const adapters: Logger[] = [];

  const clientLoggingFeature = featureService.getFeature<ClientLoggingFeature>('clientLogging');
  if (isClient() && clientLoggingFeature.enabled) {
    if (clientLoggingFeature.logToConsole) {
      const console = window.console;
      const feature = featureService.getFeature<ClientLoggingFeature>('clientLogging');
      const logLevels = feature?.logLevels || [];
      const consoleAdapter: Logger = new ClientConsoleLoggerAdapter(console, logLevels as LogLevel[]);
      const workerAdapter: Logger = new ClientWorkerLoggerAdapter(logLevels as LogLevel[]);
      adapters.push(consoleAdapter, workerAdapter);
    }
  }

  // Add more adapters based on other features if needed

  return adapters;
}

createLoggerAdapters.inject = [DI.FeatureService] as const;
