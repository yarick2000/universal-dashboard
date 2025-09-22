import { useTranslations } from 'next-intl';

import { MessageKeyBase, NamespaceKeyBase } from '../types';

export function useLocalizations<
  TargetKey extends MessageKeyBase<NestedKey>,
  NestedKey extends NamespaceKeyBase = never,
>(namespace?: NestedKey) {
  const t = useTranslations(namespace) as unknown as (key: TargetKey) => string;
  return t;
}
