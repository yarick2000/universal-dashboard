import chalk from 'chalk';

import { getDateTimeString } from '@/utils';

function getDateStr(args: unknown): string {
  return typeof args == 'object' &&
    args !== null &&
    'timestamp' in args &&
    typeof args.timestamp === 'number'
    ? getDateTimeString(args.timestamp)
    : getDateTimeString();
}

function getSourceStr(args: unknown): string {
  return typeof args == 'object' &&
    args !== null &&
    'source' in args &&
    typeof args.source === 'string'
    ? args.source
    : 'unknown';
}

function getLogLevel(args: unknown): string {
  return typeof args == 'object' &&
    args !== null &&
    'level' in args &&
    typeof args.level === 'string'
    ? args.level
    : 'unknown';
}

export function serverFormatMessage(message: string, args: unknown): string {
  let formattedMessage = '';
  formattedMessage += `[${chalk.white(getDateStr(args))}]`;

  switch (getSourceStr(args)) {
    case 'client':
      formattedMessage += ` ${chalk.bgBlue(getSourceStr(args).toUpperCase())}`;
      break;
    case 'server':
      formattedMessage += ` ${chalk.bgGreen(getSourceStr(args).toUpperCase())}:`;
      break;
    default:
      formattedMessage += ` ${chalk.bgGray(getSourceStr(args).toUpperCase())}:`;
      break;
  }

  switch (getLogLevel(args)) {
    case 'trace':
      formattedMessage += ` ${chalk.gray(getLogLevel(args).toUpperCase())}:`;
      break;
    case 'debug':
      formattedMessage += ` ${chalk.white(getLogLevel(args).toUpperCase())}:`;
      break;
    case 'info':
      formattedMessage += ` ${chalk.green(getLogLevel(args).toUpperCase())}:`;
      break;
    case 'warn':
      formattedMessage += ` ${chalk.yellow(getLogLevel(args).toUpperCase())}:`;
      break;
    case 'error':
      formattedMessage += ` ${chalk.red(getLogLevel(args).toUpperCase())}:`;
      break;
    default:
      formattedMessage += ` ${chalk.gray(getLogLevel(args).toUpperCase())}:`;
      break;
  }

  formattedMessage += ` ${message}`;

  return formattedMessage;
}
