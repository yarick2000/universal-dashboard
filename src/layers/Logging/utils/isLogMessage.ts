import { LogMessage } from '../types';

export function isLogMessage(message: unknown): message is LogMessage<unknown> {
  return (
    typeof message === 'object' &&
    message !== null &&
    'level' in message &&
    'message' in message &&
    'timestamp' in message &&
    'source' in message &&
    (message.source === 'server' || message.source === 'client') &&
    'host' in message
  );
}

