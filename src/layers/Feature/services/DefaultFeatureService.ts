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
    const featureConfig = this.configService.toObject(`features.${featureName}`);
    if (featureConfig && typeof featureConfig === 'object' && 'enabled' in featureConfig) {
      return featureConfig as T;
    }
    return { enabled: false } as T; // Return a default value if the feature is not found
  }

  static inject = [DI.ConfigService] as const;
};
