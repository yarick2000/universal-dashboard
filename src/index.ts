import { DI } from '@/enums';

import injector from './di';

export const configService = injector.resolve<DI.ConfigService>(DI.ConfigService);
