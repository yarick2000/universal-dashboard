import { ClientConfig } from '@/layers/Configuration';

const config: ClientConfig = {
  features: {
    clientLogging: {
      enabled: true,
      logLevels: ['trace', 'debug','info', 'warn', 'error'],
      logToConsole: true,
      logToServer: false,
    },
  },
};

export default config;
