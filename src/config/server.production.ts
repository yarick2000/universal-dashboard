import { ServerConfig } from '@/layers/Configuration';

const config: ServerConfig = {
  features: {
    openTelemetry: {
      enabled: true,
      serviceName: 'universal-dashboard',
    },
  },
};

export default config;
