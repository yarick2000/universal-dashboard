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
      logToConsole: true,
      logToFile: true,
      logToFilePath: './log',
      logToFileNamePattern: 'universal-dashboard-%DATE%-%PART%.log',
      logToFileBatchSize: 2,
      logToFileIdleTimeSec: 5,
      logToFileMaxStoragePeriodDays: 7,
      logToFileMaxFileSize: 10485760,
    },
  },
  envVariables: {
    NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: 'REPLACE-WITH-ENCRYPTED-VALUE',
  },
};

export default config;
