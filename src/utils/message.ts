import { WindowMessageTypes } from '@/enums';

/**
 * Send a message to the window.
 * @template T The type of the data to send with the message.
 * @param message - The type of message to send.
 * @param data - An optional object to send with the message.
 * @param origin - An optional string representing the origin of the window to send the message to.
 * @returns void
 */
export function post<T>(message: WindowMessageTypes, data?: T, origin?: string) {
  window.postMessage(
    {
      ...data,
      type: message as string,
    },
    origin || window.origin,
  );
}
