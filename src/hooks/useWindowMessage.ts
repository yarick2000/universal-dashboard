'use client';

import { useEffect } from 'react';

import { WindowMessageTypes } from '@/enums';
import { WindowMessage, WindowMessageCallback } from '@/types';

/**
 * A hook that listens for window messages of specified types and calls a callback function when a message is received.
 * @param types - An array of strings representing the types of messages to listen for.
 * @param callback - A function to call when a message of the specified type is received. The function receives the message object and a send function to send a response message.
 * @param origin - An optional string representing the origin of the window sending the message. If specified, messages will only be processed if they come from this origin.
 * @param validateType - An optional function to validate the type of the message. The function receives the types array and the message event and should return true if the message type is valid.
 */
export function useWindowMessage<T>(
  types: WindowMessageTypes[],
  callback: WindowMessageCallback<T>,
  origin?: string,
  validateType?: (
    types: WindowMessageTypes[],
    event: MessageEvent<WindowMessage<T>>
  ) => boolean,
) {
  useEffect(() => {
    const listener = (event: MessageEvent<WindowMessage<T>>) => {
      let isValidType = false;
      if (validateType) {
        isValidType = validateType(types, event);
      } else {
        isValidType = (types as string[]).includes(event.data.type);
      }
      if (isValidType && (event.origin === (origin ?? window.origin) || origin === '*')) {
        callback(event.data, (message: WindowMessage<T>) => {
          (event.source ?? window).postMessage(message, {
            targetOrigin: event.origin,
          });
        });
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [callback, origin, types, validateType]);
}
