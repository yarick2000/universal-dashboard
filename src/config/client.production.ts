import { ClientConfig } from '@/layers/Configuration';

const config: ClientConfig = {
  features: {
    clientLogging: {
      enabled: true,
      logLevels: ['info', 'warn', 'error'],
      logToConsole: true,
      logToServer: false,
      logToServerBatchSize: 100,
      logToServerIdleTimeSec: 10,
    },
  },
};

export default config;
