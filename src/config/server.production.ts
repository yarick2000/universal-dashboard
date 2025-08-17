import { ServerConfig } from '@/layers/Configuration';

const config: ServerConfig = {
  features: {
    openTelemetry: {
      enabled: true,
      serviceName: 'universal-dashboard',
    },
    fileLogging: {
      enabled: false,
      logLevels: ['info', 'warn', 'error'],
      filePath: './log',
      fileNamePattern: '%DATE%-%PART%.log',
      batchSize: 10,
      idleTimeSec: 10,
      maxFileSize: 10485760,
      maxStoragePeriodDays: 30,
    },
    consoleLogging: {
      enabled: true,
      logLevels: ['info', 'warn', 'error'],
    },
    supabaseLogging: {
      enabled: false,
      logLevels: ['info', 'warn', 'error'],
      batchSize: 10,
      idleTimeSec: 10,
    },
  },
  envVariables: {
    NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: 'REPLACE-WITH-ENCRYPTED-VALUE',
    SUPABASE_URL: 'https://your-supabase-url.supabase.co',
    SUPABASE_KEY: 'REPLACE-WITH-ENCRYPTED-VALUE',
  },
};

export default config;
