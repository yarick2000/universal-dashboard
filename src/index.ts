import injector from '@/di';
import { DI } from '@/enums';
import { ConfigService } from '@/layers/Configuration';
import { FeatureService } from '@/layers/Feature';
import { LocalizationService } from '@/layers/Internationalization';
import { LoggerService } from '@/layers/Logging';

export const configService: ConfigService = injector.resolve<DI.ConfigService>(DI.ConfigService);
export const featureService: FeatureService = injector.resolve<DI.FeatureService>(DI.FeatureService);
export const loggerService: LoggerService = injector.resolve<DI.LoggerService>(DI.LoggerService);
export const i18nService: LocalizationService =
	injector.resolve<DI.LocalizationService>(DI.LocalizationService);
