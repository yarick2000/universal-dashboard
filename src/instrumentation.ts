import { featureService } from '@/index';

export function register() {
  const openTelemetryFeature = featureService.getFeature('openTelemetry');
  if (openTelemetryFeature?.enabled) {
    // Initialize OpenTelemetry instrumentation here
    console.log('OpenTelemetry is enabled.');
  } else {
    console.warn('OpenTelemetry feature is not enabled.');
  }
}
