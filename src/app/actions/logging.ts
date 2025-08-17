'use server';

import { loggerService } from '@/index';
import { LogMessage } from '@/layers/Logging';

export async function recordClientSideLogs(logMessages: LogMessage<unknown>[]) {
  await loggerService.bulk(logMessages);
}
