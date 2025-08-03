import { FeatureName, FeatureBase } from '@/layers/Configuration';
import { ConfigService } from '@/layers/Configuration/interfaces';

import { DefaultFeatureService } from './DefaultFeatureService';

describe('DefaultFeatureService', () => {
  let service: DefaultFeatureService;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    mockConfigService = {
      toObject: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    service = new DefaultFeatureService(mockConfigService);
  });

  describe('getFeature', () => {
    it('should return feature configuration when valid feature exists', () => {
      const mockConfig = {
        features: {
          testFeature: { enabled: true, setting: 'value' },
        },
      };
      mockConfigService.toObject.mockReturnValue(mockConfig);

      const result = service.getFeature<FeatureBase>('testFeature' as FeatureName);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockConfigService.toObject).toHaveBeenCalledWith();
      expect(result).toEqual({ enabled: true, setting: 'value' });
    });

    it('should return default disabled feature when config is null', () => {
      mockConfigService.toObject.mockReturnValue(null);

      const result = service.getFeature<FeatureBase>('testFeature' as FeatureName);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockConfigService.toObject).toHaveBeenCalledWith();
      expect(result).toEqual({ enabled: false });
    });

    it('should return default disabled feature when config is undefined', () => {
      mockConfigService.toObject.mockReturnValue(undefined);

      const result = service.getFeature<FeatureBase>('testFeature' as FeatureName);

      expect(result).toEqual({ enabled: false });
    });

    it('should return default disabled feature when config has no features', () => {
      const mockConfig = {
        otherProperty: 'value',
      };
      mockConfigService.toObject.mockReturnValue(mockConfig);

      const result = service.getFeature<FeatureBase>('testFeature' as FeatureName);

      expect(result).toEqual({ enabled: false });
    });

    it('should return default disabled feature when feature does not exist', () => {
      const mockConfig = {
        features: {
          otherFeature: { enabled: true },
        },
      };
      mockConfigService.toObject.mockReturnValue(mockConfig);

      const result = service.getFeature<FeatureBase>('testFeature' as FeatureName);

      expect(result).toEqual({ enabled: false });
    });

    it('should handle feature with boolean true value', () => {
      const mockConfig = {
        features: {
          testFeature: true,
        },
      };
      mockConfigService.toObject.mockReturnValue(mockConfig);

      const result = service.getFeature<FeatureBase>('testFeature' as FeatureName);

      expect(result).toEqual({ enabled: true });
    });

    it('should handle feature with boolean false value', () => {
      const mockConfig = {
        features: {
          testFeature: false,
        },
      };
      mockConfigService.toObject.mockReturnValue(mockConfig);

      const result = service.getFeature<FeatureBase>('testFeature' as FeatureName);

      expect(result).toEqual({ enabled: false });
    });
  });

  describe('static inject', () => {
    it('should have correct dependency injection configuration', () => {
      expect(DefaultFeatureService.inject).toEqual(['ConfigService']);
    });
  });
});
