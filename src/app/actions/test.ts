'use server';

import { loggerService } from '@/index';

export async function testError() {
  try {
    // Simulate an error
    throw new Error('This is a server side test error.');
  } catch (error) {
    await loggerService.error('Error in ServerTestErrorButton:', error);
  }
}
