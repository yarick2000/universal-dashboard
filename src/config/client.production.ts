import { ClientConfig } from '@/layers/Configuration';

const config: ClientConfig = {
  i18n: {
    cookieName: 'UD_LOCALE',
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  },
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
  envVariables: {
    NEXT_PUBLIC_BASE_URL: 'https://universal-dashboard-tawny.vercel.app',
  },
};

export default config;
