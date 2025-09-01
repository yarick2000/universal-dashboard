import { FeatureBase, FeatureName } from '@/layers/Configuration/types';

/**
 * Service interface for managing and retrieving feature configurations.
 * This interface defines the contract for accessing feature-specific data
 * or configurations by their feature name.
 */
export interface FeatureService {
  /**
   * Retrieves the configuration or data for a specific feature by its name.
   * @param featureName - The name of the feature to retrieve.
   * @returns The configuration or data associated with the specified feature.
   */
  getFeature<T extends FeatureBase>(featureName: FeatureName): T;
};
