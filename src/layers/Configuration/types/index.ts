export type FeatureName = 'openTelemetry' | 'clientLogging' | 'serverLogging';

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
  features: Feature<'clientLogging', ClientLoggingFeature>;
  envVariables?: Record<string, string>;
};

export type ServerConfig = {
  features: Feature<'openTelemetry', OpenTelemetryFeature> & Feature<'serverLogging', ServerLoggingFeature>;
  envVariables?: Record<ServerEnvironmentVariable, string>;
};

export type Config = ServerConfig;

export type OpenTelemetryFeature = FeatureBase & { serviceName: string };

export type ClientLoggingFeature = FeatureBase & {
  logLevels: string[];
  logToConsole: boolean;
  logToServer: boolean;
  logToServerBatchSize: number;
  logToServerIdleTimeSec: number;
};

export type ServerLoggingFeature = FeatureBase & {
  logLevels: string[];
  logToConsole: boolean;
  logToFile: boolean;
  logToFilePath: string;
  logToFileNamePattern: string;
  logToFileBatchSize: number;
  logToFileIdleTimeSec: number;
  logToFileMaxStoragePeriodDays: number;
  logToFileMaxFileSize: number;
  logToSupabase: boolean;
  logToSupabaseBatchSize: number;
  logToSupabaseIdleTimeSec: number;
};
