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
      const mockFeatureConfig = { enabled: true, setting: 'value' };
      mockConfigService.toObject.mockReturnValue(mockFeatureConfig);

      const result = service.getFeature<FeatureBase>('testFeature' as FeatureName);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockConfigService.toObject).toHaveBeenCalledWith('features.testFeature');
      expect(result).toEqual(mockFeatureConfig);
    });

    it('should return default disabled feature when config is null', () => {
      mockConfigService.toObject.mockReturnValue(null);

      const result = service.getFeature<FeatureBase>('testFeature' as FeatureName);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockConfigService.toObject).toHaveBeenCalledWith('features.testFeature');
      expect(result).toEqual({ enabled: false });
    });

    it('should return default disabled feature when config is undefined', () => {
      mockConfigService.toObject.mockReturnValue(undefined);

      const result = service.getFeature<FeatureBase>('testFeature' as FeatureName);

      expect(result).toEqual({ enabled: false });
    });

    it('should return default disabled feature when config is not an object', () => {
      mockConfigService.toObject.mockReturnValue('not an object');

      const result = service.getFeature<FeatureBase>('testFeature' as FeatureName);

      expect(result).toEqual({ enabled: false });
    });

    it('should return default disabled feature when config object does not have enabled property', () => {
      const mockFeatureConfig = { setting: 'value' };
      mockConfigService.toObject.mockReturnValue(mockFeatureConfig);

      const result = service.getFeature<FeatureBase>('testFeature' as FeatureName);

      expect(result).toEqual({ enabled: false });
    });

    it('should handle feature with enabled false', () => {
      const mockFeatureConfig = { enabled: false, setting: 'value' };
      mockConfigService.toObject.mockReturnValue(mockFeatureConfig);

      const result = service.getFeature<FeatureBase>('testFeature' as FeatureName);

      expect(result).toEqual(mockFeatureConfig);
    });
  });

  describe('static inject', () => {
    it('should have correct dependency injection configuration', () => {
      expect(DefaultFeatureService.inject).toEqual(['ConfigService']);
    });
  });
});
