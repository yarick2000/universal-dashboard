export type FeatureName = 'openTelemetry' | 'clientLogging';

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
  features: Feature<'openTelemetry', OpenTelemetryFeature>;
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
