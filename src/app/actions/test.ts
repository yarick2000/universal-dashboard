'use server';

import { loggerService } from '@/index';
import { createLogger } from '@/layers/Logging/utils';

const logger = createLogger(loggerService, import.meta.url);

export async function testError() {
  try {
    // Simulate an error
    throw new Error('This is a server side test error.');
  } catch (error) {
    await logger.error('Error in ServerTestErrorButton:', error);
  }
}
