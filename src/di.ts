import { createInjector, Scope } from 'typed-inject';

import { createDefaultConfigService } from '@/layers/Configuration/utils';

import { DI } from './enums';
import { DefaultFeatureService } from './layers/Feature/services';

const injector = createInjector()
  .provideFactory(DI.ConfigService, createDefaultConfigService, Scope.Singleton)
  .provideClass(DI.FeatureService, DefaultFeatureService, Scope.Singleton);

export default injector;
