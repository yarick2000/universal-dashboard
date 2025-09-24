export type FeatureName =
  | 'openTelemetry'
  | 'consoleLogging'
  | 'workerLogging'
  | 'fileLogging'
  | 'supabaseLogging'
  | 'analytics'
  | 'speedInsights';

export type ClientEnvironmentVariable =
  | 'NEXT_PUBLIC_BASE_URL'
  | 'NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY';

export type ServerEnvironmentVariable =
  | 'AUTH_SECRET'
  | 'AUTH_SALT'
  | 'NEXT_SERVER_ACTIONS_ENCRYPTION_KEY'
  | 'SUPABASE_URL'
  | 'SUPABASE_KEY'
  | 'GOOGLE_RECAPTCHA_SECRET'
  | 'GOOGLE_RECAPTCHA_MIN_SCORE';

export type FeatureBase = {
  enabled: boolean;
};

type Feature<N extends FeatureName, T extends FeatureBase> = {
  [K in N]: boolean | T;
};

export type ClientConfig = {
  i18n: {
    cookieName: string;
    defaultLocale: string;
    locales: string[];
  };
  features: Feature<'consoleLogging', ConsoleLoggingFeature> & Feature<'workerLogging', WorkerLoggingFeature>;
  envVariables?: Record<ClientEnvironmentVariable, string>;
};

export type ServerConfig = {
  features: Feature<'openTelemetry', OpenTelemetryFeature> &
    Feature<'consoleLogging', ConsoleLoggingFeature> &
    Feature<'fileLogging', FileLoggingFeature> &
    Feature<'supabaseLogging', SupabaseLoggingFeature> &
    Feature<'analytics', FeatureBase> &
    Feature<'speedInsights', FeatureBase>;
  envVariables?: Record<ServerEnvironmentVariable, string>;
};

export type Config = ServerConfig;

export type OpenTelemetryFeature = FeatureBase & { serviceName: string };

type BaseLoggingFeature = {
  logLevels: string[];
};

export type ConsoleLoggingFeature = FeatureBase & BaseLoggingFeature;

export type FileLoggingFeature = FeatureBase & BaseLoggingFeature & {
  filePath: string;
  fileNamePattern: string;
  batchSize: number;
  idleTimeSec: number;
  maxStoragePeriodDays: number;
  maxFileSize: number;
};

export type SupabaseLoggingFeature = FeatureBase & BaseLoggingFeature & {
  batchSize: number;
  idleTimeSec: number;
};

export type WorkerLoggingFeature = FeatureBase & BaseLoggingFeature & {
  batchSize: number;
  idleTimeSec: number;
};

