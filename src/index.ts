import injector from '@/di';
import { DI } from '@/enums';
import { ConfigService } from '@/layers/Configuration';
import { FeatureService } from '@/layers/Feature';

export const configService: ConfigService = injector.resolve<DI.ConfigService>(DI.ConfigService);
export const featureService: FeatureService = injector.resolve<DI.FeatureService>(DI.FeatureService);
