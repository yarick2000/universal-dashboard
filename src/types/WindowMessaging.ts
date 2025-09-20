/**
 * The type of a message sent between windows.
 * @template T The type of the message.
 */
export type WindowMessage<T> = T & {
  /** The type of the message. */
  type: string;
};

/**
 *  The type of a callback function that handles a message.
 * @template T The type of the message.
 */
export type WindowMessageCallback<T> = (
  /** The message to handle. */
  message: WindowMessage<T>,
  /** A function to send a response message. */
  send: (message: WindowMessage<T>) => void
) => void;
