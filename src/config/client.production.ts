import { ClientConfig } from '@/layers/Configuration';

const config: ClientConfig = {
  features: {
    clientLogging: {
      enabled: true,
      logLevels: ['info', 'warn', 'error'],
      logToConsole: true,
      logToServer: false,
    },
  },
};

export default config;
