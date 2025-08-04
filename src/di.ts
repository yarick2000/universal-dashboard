import { createInjector, Scope } from 'typed-inject';

import { DI } from '@/enums';
import { createDefaultConfigService } from '@/layers/Configuration/utils';
import { DefaultFeatureService } from '@/layers/Feature/services';
import { DefaultLoggerService } from '@/layers/Logging/services';
import { createLoggerAdapters } from '@/layers/Logging/utils';

const injector = createInjector()
  .provideFactory(DI.ConfigService, createDefaultConfigService, Scope.Singleton)
  .provideClass(DI.FeatureService, DefaultFeatureService, Scope.Singleton)
  .provideFactory(DI.LoggerFactory, createLoggerAdapters, Scope.Singleton)
  .provideClass(DI.LoggerService, DefaultLoggerService, Scope.Singleton);

export default injector;
