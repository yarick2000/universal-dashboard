import { ServerConfig } from '@/layers/Configuration';

const config: ServerConfig = {
  features: {
    openTelemetry: {
      enabled: true,
      serviceName: 'universal-dashboard',
    },
    serverLogging: {
      enabled: true,
      logLevels: ['error', 'warn', 'info'],
      logToConsole: false,
      logToFile: true,
      logToFilePath: './log',
      logToFileNamePattern: 'universal-dashboard-%DATE%-%PART%.log',
      logToFileBatchSize: 100,
      logToFileIdleTimeSec: 5,
      logToFileMaxStoragePeriodDays: 7,
      logToFileMaxFileSize: 10485760,
    },
  },
};

export default config;
