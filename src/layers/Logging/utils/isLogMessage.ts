import { ClientSideLogMessage, LogMessage, ServerSideLogMessage } from '../types';

export function isLogMessage(message: unknown): message is LogMessage<unknown> {
  return (
    typeof message === 'object' &&
    message !== null &&
    'level' in message &&
    'message' in message &&
    'timestamp' in message
  );
}

export function isClientLogMessage(message: unknown): message is ClientSideLogMessage<unknown> {
  return (
    isLogMessage(message) &&
    'source' in message &&
    message.source === 'client'
  );
}

export function isServerLogMessage(message: unknown): message is ServerSideLogMessage<unknown> {
  return (
    isLogMessage(message) &&
    'source' in message &&
    message.source === 'server'
  );
}
