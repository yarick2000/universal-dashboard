import { DI } from '@/enums';
import { FeatureBase, FeatureName } from '@/layers/Configuration';
import { ConfigService } from '@/layers/Configuration/interfaces';

import { FeatureService } from '../interfaces';

/**
 * Default implementation of the FeatureService interface.
 * This service retrieves feature configurations from the ConfigService.
 */
export class DefaultFeatureService implements FeatureService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Retrieves the configuration or data for a specific feature by its name.
   * @param featureName The name of the feature to retrieve.
   * @template T The expected type of the feature configuration.
   * @returns The feature configuration object of type T, or a default disabled feature if not found.
   */
  getFeature<T extends FeatureBase>(featureName: FeatureName): T {
    const fullConfig = this.configService.toObject();
    const featureConfig = (fullConfig as { features?: Record<string, unknown> })?.features;

    if (!featureConfig || typeof featureConfig !== 'object') {
      return { enabled: false } as T;
    }

    const featureObject = featureConfig[featureName] as boolean | T | undefined;

    if (!featureObject) {
      return { enabled: false } as T;
    }

    if (typeof featureObject === 'boolean') {
      return { enabled: featureObject } as T;
    }

    if (typeof featureObject === 'object' && featureObject !== null) {
      return featureObject;
    }

    return { enabled: false } as T;
  }

  static inject = [DI.ConfigService] as const;
};
