export type FeatureName = 'openTelemetry';

export type FeatureBase = {
  enabled: boolean;
};

type Feature<N extends FeatureName, T extends FeatureBase> = {
  [K in N]: boolean | T;
};

export type ServerConfig = {
  features: OpenTelemetryFeature;
};

export type Config = ServerConfig;

export type OpenTelemetryFeature = Feature<'openTelemetry', FeatureBase & { serviceName: string }>;
