import { Home } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

import { useLocalizations } from '@/layers/Internationalization/hooks/useLocalizations';
import { HamburgerMenuProps } from '@/shadcn/components/HamburgerMenu';
import { HamburgerMenuItem } from '@/shadcn/components/HamburgerMenu/types';

export type UseHamburgerMenuProps = Omit<
  HamburgerMenuProps,
  'isOpen' | 'menuItems' | 'onMenuItemClick' | 'onToggle'
> & {
  items?: HamburgerMenuItem[];
};

export function useHamburgerMenu(props: UseHamburgerMenuProps): HamburgerMenuProps {
  const { items } = props;
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useLocalizations('components.headerMenu');

  const itemsToRender = useMemo(() => {
    const defaultItems: HamburgerMenuItem[] = [
      {
        name: 'home',
        label: t('home'),
        href: `/${locale}/`,
        type: 'button',
        icon: <Home className="h-4 w-4" />,
      },
      { name: 'docs', label: t('docs'), href: `/${locale}/docs`, type: 'link' },
      { name: 'help', label: t('help'), href: `/${locale}/help`, type: 'link' },
      { name: 'blog', label: t('blog'), href: `/${locale}/blog`, type: 'link' },
    ];
    return items ?? defaultItems;
  }, [items, locale, t]);

  const menuItems = useMemo(() => {
    return itemsToRender.map((item) => ({
      ...item,
      isActive: pathname === item.href,
    }));
  }, [itemsToRender, pathname]);

  const onMenuItemClick = useCallback((name: string, href?: string) => {
    if (href) {
      router.push(href);
    }
    if (name === 'home') {
      router.push(`/${locale}/`);
    }
    setIsOpen(false);
  }, [locale, router]);

  const onToggle = useCallback(() => setIsOpen((o) => !o), []);

  return {
    isOpen,
    menuItems,
    onMenuItemClick,
    onToggle,
  };
}
