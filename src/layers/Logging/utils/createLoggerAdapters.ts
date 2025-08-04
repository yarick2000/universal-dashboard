import { DI } from '@/enums';
import { ClientLoggingFeature } from '@/layers/Configuration';
import { FeatureService } from '@/layers/Feature';
import { isClient } from '@/utils';

import { ClientConsoleLoggerAdapter } from '../adapters/ClientConsoleLoggerAdapter';
import { Logger } from '../interfaces';

export function createLoggerAdapters(featureService: FeatureService): Logger[] {
  const adapters: Logger[] = [];

  const clientLoggingFeature = featureService.getFeature<ClientLoggingFeature>('clientLogging');
  if (isClient() && clientLoggingFeature.enabled) {
    if (clientLoggingFeature.logToConsole) {
      const console = window.console;
      const consoleAdapter: Logger = new ClientConsoleLoggerAdapter(console, featureService);
      adapters.push(consoleAdapter);
    }
  }

  // Add more adapters based on other features if needed

  return adapters;
}

createLoggerAdapters.inject = [DI.FeatureService] as const;
