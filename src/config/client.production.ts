import { ClientConfig } from '@/layers/Configuration';

const config: ClientConfig = {
  features: {
    consoleLogging: {
      enabled: true,
      logLevels: ['info', 'warn', 'error'],
    },
    workerLogging: {
      enabled: true,
      logLevels: ['info', 'warn', 'error'],
      batchSize: 100,
      idleTimeSec: 10,
    },
  },
};

export default config;
