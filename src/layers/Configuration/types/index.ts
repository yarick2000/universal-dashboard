export type FeatureName = 'openTelemetry' | 'clientLogging' | 'serverLogging';

export type FeatureBase = {
  enabled: boolean;
};

type Feature<N extends FeatureName, T extends FeatureBase> = {
  [K in N]: boolean | T;
};

export type ClientConfig = {
  features: Feature<'clientLogging', ClientLoggingFeature>;
};

export type ServerConfig = {
  features: Feature<'openTelemetry', OpenTelemetryFeature> & Feature<'serverLogging', ServerLoggingFeature>;
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
};
