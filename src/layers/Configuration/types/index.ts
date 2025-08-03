export type FeatureName = 'openTelemetry';

export type FeatureBase = {
  enabled: boolean;
};

type Feature<N extends FeatureName, T extends FeatureBase> = {
  [K in N]: boolean | T;
};

type OpenTelemetryFeature = Feature<'openTelemetry', FeatureBase & { serviceName: string }>;

export type ServerConfig = {
  features: OpenTelemetryFeature;
};

export type Config = ServerConfig;
