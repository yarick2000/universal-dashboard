import { LoggerFormatter } from '../interfaces';

export function format(formatters: LoggerFormatter[], message: string, ...args: unknown[]) {
  let messageFormatted = message;
  let paramsFormatted = args;
  formatters.forEach(formatter => {
    const formatted = formatter.format(messageFormatted, ...paramsFormatted);
    messageFormatted = formatted.message;
    paramsFormatted = formatted.args;
  });
  return {
    message: messageFormatted,
    args: paramsFormatted,
  };
}
