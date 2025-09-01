export type FeatureName =
  | 'openTelemetry'
  | 'consoleLogging'
  | 'workerLogging'
  | 'fileLogging'
  | 'supabaseLogging'
  | 'analytics'
  | 'speedInsights';

export type ServerEnvironmentVariable =
  | 'NEXT_SERVER_ACTIONS_ENCRYPTION_KEY'
  | 'SUPABASE_URL'
  | 'SUPABASE_KEY';

export type FeatureBase = {
  enabled: boolean;
};

type Feature<N extends FeatureName, T extends FeatureBase> = {
  [K in N]: boolean | T;
};

export type ClientConfig = {
  features: Feature<'consoleLogging', ConsoleLoggingFeature> & Feature<'workerLogging', WorkerLoggingFeature>;
  envVariables?: Record<string, string>;
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

