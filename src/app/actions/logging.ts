'use server';

import { loggerService } from '@/index';
import { ClientSideLogMessage } from '@/layers/Logging';

export async function recordClientSideLogs(logMessages: ClientSideLogMessage<unknown>[]) {
  await loggerService.bulk(logMessages);
}
