import { getDateTimeString } from '@/utils';

export function clientFormatMessage(message: string, args: unknown): string {
  const dateStr = typeof args == 'object' &&
    args !== null &&
    'timestamp' in args &&
    typeof args.timestamp === 'number'
    ? getDateTimeString(args.timestamp)
    : getDateTimeString();
  return `[${dateStr}] ${message}`;
}
