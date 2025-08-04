import { featureService } from '@/index';
import { OpenTelemetryFeature } from '@/layers/Configuration';

export function register() {
  const openTelemetryFeature = featureService.getFeature<OpenTelemetryFeature>('openTelemetry');
  if (openTelemetryFeature.enabled) {
    // Initialize OpenTelemetry instrumentation here
    console.log('OpenTelemetry is enabled.');
  } else {
    console.warn('OpenTelemetry feature is not enabled.');
  }
}
