
import { ClientLoggingFeature } from '@/layers/Configuration';
import { FeatureService } from '@/layers/Feature';

import { Logger } from '../interfaces';
import { LogLevel } from '../types';

export class ClientConsoleLoggerAdapter implements Logger {

  private readonly console: Console;
  private readonly logLevels: LogLevel[];

  constructor (_console: Console, featureService: FeatureService) {
    this.console = _console;
    const feature = featureService.getFeature<ClientLoggingFeature>('clientLogging');
    this.logLevels = (feature?.logLevels as LogLevel[]) || [];
  }

  assert(condition: boolean, fn: () => void): void {
    if (!condition) {
      fn();
    }
  }

  group(name: string, fn: () => void, collapsed: boolean = true): void {
    if (collapsed) {
      this.console.groupCollapsed(name);
    } else {
      this.console.group(name);
    }
    fn();
    this.console.groupEnd();
  }

  log(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('log')) {
      this.console.log(message, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('info')) {
      this.console.info(message, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('warn')) {
      this.console.warn(message, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('error')) {
      this.console.error(message, ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('debug')) {
      this.console.debug(message, ...args);
    }
  }

  trace(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('trace')) {
      this.console.trace(message, ...args);
    }
  }
}
