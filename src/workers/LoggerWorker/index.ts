import { serializeError } from 'serialize-error';

import { WorkerMessage } from '../types';

function processArgs(args: unknown[]): unknown[] {
  return args.map(arg => {
    if (arg instanceof Error) {
      return serializeError(arg);
    }
    return arg;
  });
}

onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { domain, type, message, args } = event.data;
  if (!domain || !type || !message) {
    postMessage(new Error('Invalid message received in LoggerWorker'));
    return;
  }
  try {
    await fetch(`${domain}/api/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({  type, message, args: processArgs(args) }),
    });
  } catch (error) {
    postMessage(error);
  }
};
