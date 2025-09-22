import { getTranslations } from 'next-intl/server';

import { MessageKeyBase, NamespaceKeyBase } from '../../types';

export async function getLocalizations<
  TargetKey extends MessageKeyBase<NestedKey>,
  NestedKey extends NamespaceKeyBase = never,
>(namespace?: NestedKey) {
  const t = await getTranslations(namespace) as unknown as (key: TargetKey) => string;
  return t;
}
