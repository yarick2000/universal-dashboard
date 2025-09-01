import { registerOTel } from '@vercel/otel';

import { featureService } from '@/index';
import { OpenTelemetryFeature } from '@/layers/Configuration';

export function register() {
  const openTelemetryFeature = featureService.getFeature<OpenTelemetryFeature>('openTelemetry');
  if (openTelemetryFeature.enabled) {
    // Initialize OpenTelemetry instrumentation here
    registerOTel({ serviceName: openTelemetryFeature.serviceName });
  }
}
