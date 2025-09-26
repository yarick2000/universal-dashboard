import { createInjector, Scope } from 'typed-inject';

import { DI } from '@/enums';
import { DefaultAuthenticationService } from '@/layers/Authentication/services';
import { createAuthenticationProvider } from '@/layers/Authentication/utils';
import { createDefaultConfigService } from '@/layers/Configuration/utils';
import {
  createLocalApiDataClient,
  createRemoteApiDataClient,
  createSupabaseDataClient,
} from '@/layers/Data/utils';
import { DefaultFeatureService } from '@/layers/Feature/services';
import { DefaultLocalizationService } from '@/layers/Internationalization/services';
import { createLocalizationDataAdapter } from '@/layers/Internationalization/utils';
import { DefaultLoggerService } from '@/layers/Logging/services';
import { createLoggerAdapters, createLoggerInfoProviders } from '@/layers/Logging/utils';
import { DefaultSeoService } from '@/layers/SEO/services';

const injector = createInjector()
  .provideFactory(DI.LocalApiDataClient, createLocalApiDataClient, Scope.Singleton)
  .provideFactory(DI.RemoteApiDataClient, createRemoteApiDataClient, Scope.Singleton)
  .provideFactory(DI.SupabaseDataClient, createSupabaseDataClient, Scope.Singleton)
  .provideFactory(DI.ConfigService, createDefaultConfigService, Scope.Singleton)
  .provideClass(DI.FeatureService, DefaultFeatureService, Scope.Singleton)
  .provideFactory(DI.LoggerFactory, createLoggerAdapters, Scope.Singleton)
  .provideFactory(DI.LoggerInfoProviderFactory, createLoggerInfoProviders, Scope.Singleton)
  .provideClass(DI.LoggerService, DefaultLoggerService, Scope.Singleton)
  .provideFactory(DI.LocalizationDataAdapter, createLocalizationDataAdapter, Scope.Singleton)
  .provideClass(DI.LocalizationService, DefaultLocalizationService, Scope.Singleton)
  .provideFactory(DI.AuthenticationProvider, createAuthenticationProvider, Scope.Singleton)
  .provideClass(DI.AuthenticationService, DefaultAuthenticationService, Scope.Singleton)
  .provideClass(DI.SEOService, DefaultSeoService, Scope.Singleton);

export default injector;
