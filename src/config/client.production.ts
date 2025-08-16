import { ClientConfig } from '@/layers/Configuration';

const config: ClientConfig = {
  features: {
    clientLogging: {
      enabled: true,
      logLevels: ['info', 'warn', 'error'],
      logToConsole: true,
      logToServer: true,
      logToServerBatchSize: 2,
      logToServerIdleTimeSec: 5,
    },
  },
};

export default config;
