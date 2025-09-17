import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';

import { HeaderMenuProps } from '@/shadcn/components/HeaderMenu';

export type UseHeaderMenuProps = Omit<HeaderMenuProps, 'menuItems' | 'onMenuItemClick'> & {
  // Optionally allow overriding default items
  items?: { name: string; label: string; href: string }[];
};


export function useHeaderMenu(props: UseHeaderMenuProps): HeaderMenuProps {
  const { items, ...rest } = props;
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('components.headerMenu');

  const itemsToRender = useMemo(() => {
    const defaultItems: { name: string; label: string; href: string }[] = [
      { name: 'docs', label: t('docs'), href: `/${locale}/docs` },
      { name: 'help', label: t('help'), href: `/${locale}/help` },
      { name: 'blog', label: t('blog'), href: `/${locale}/blog` },
    ];
    return items ?? defaultItems;
  }, [items, locale, t]);

  const menuItems = useMemo(() => {
    return itemsToRender.map((item) => ({
      ...item,
      isActive: pathname === item.href,
    }));
  }, [itemsToRender, pathname]);

  const onMenuItemClick = useCallback((name: string, href: string) => {
    router.push(href);
  }, [router]);

  return {
    ...rest,
    menuItems,
    onMenuItemClick,
  } as HeaderMenuProps;
}
