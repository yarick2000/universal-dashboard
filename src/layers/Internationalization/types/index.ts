import { MessageKeys, NamespaceKeys, NestedKeyOf, NestedValueOf } from 'next-intl';
import { JSXElementConstructor, ReactElement } from 'react';

/**
 * The internationalization messages keys
 */
export type MessageKey = NamespaceKeys<IntlMessages, NestedKeyOf<IntlMessages>>;

/**
 * The internationalization messages key for specific namespace
 */
export type MessageKeyBase<
  T extends NamespaceKeys<IntlMessages, NestedKeyOf<IntlMessages>>,
> = MessageKeys<
  NestedValueOf<{ '!': IntlMessages }, [T] extends [never] ? '!' : `!.${T}`>,
  NestedKeyOf<NestedValueOf<{ '!': IntlMessages }, [T] extends [never] ? '!' : `!.${T}`>>
>;

/**
 * The internationalization namespace keys
 */
export type NamespaceKeyBase = NamespaceKeys<IntlMessages, NestedKeyOf<IntlMessages>>;

/**
 * The internationalization message (rich text format)
 */
export type RichTranslatedText =
  | string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ReactElement<any, string | JSXElementConstructor<any>>;
