'use server';

import { loggerService } from '@/index';
import { LogMessage } from '@/layers/Logging';

export async function recordClientSideLogsAction(logMessages: LogMessage<unknown>[]) {
  await loggerService.bulk(logMessages);
}
