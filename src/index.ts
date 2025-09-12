import injector from '@/di';
import { DI } from '@/enums';
import { AuthenticationService } from '@/layers/Authentication';
import { ConfigService } from '@/layers/Configuration';
import { FeatureService } from '@/layers/Feature';
import { LocalizationService } from '@/layers/Internationalization';
import { LoggerService } from '@/layers/Logging';

export const configService: ConfigService = injector.resolve<DI.ConfigService>(
  DI.ConfigService,
) as ConfigService;
export const featureService: FeatureService = injector.resolve<DI.FeatureService>(
  DI.FeatureService,
) as FeatureService;
export const loggerService: LoggerService = injector.resolve<DI.LoggerService>(
  DI.LoggerService,
) as LoggerService;
export const i18nService: LocalizationService =
	injector.resolve<DI.LocalizationService>(DI.LocalizationService);
export const authService: AuthenticationService =
	injector.resolve<DI.AuthenticationService>(DI.AuthenticationService);
