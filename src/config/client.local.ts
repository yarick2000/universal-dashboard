import { ClientConfig } from '@/layers/Configuration';

const config: ClientConfig = {
  features: {
    clientLogging: {
      enabled: true,
      logLevels: ['trace', 'debug','info', 'warn', 'error'],
      logToConsole: true,
      logToServer: true,
      logToServerBatchSize: 100,
      logToServerIdleTimeSec: 10,
    },
  },
};

export default config;
