import { merge } from 'ts-deepmerge';

import { DefaultConfigService } from '../services';

export function createDefaultConfigService() {
  const publicConfig = JSON.parse(process.env.NEXT_PUBLIC_CONFIG || '{}') as Record<string, unknown>;
  const serverConfig = JSON.parse(process.env.SERVER_CONFIG || '{}') as Record<string, unknown>;
  const config = merge(publicConfig, serverConfig);
  const configService = new DefaultConfigService();
  configService.load(config);
  return configService;
}

createDefaultConfigService.inject= [] as const;
