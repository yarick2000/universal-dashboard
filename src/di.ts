import { createInjector, Scope } from 'typed-inject';

import { createDefaultConfigService } from '@/layers/Configuration/utils';

import { DI } from './enums';

const injector = createInjector()
  .provideFactory(DI.ConfigService, createDefaultConfigService, Scope.Singleton);

export default injector;
