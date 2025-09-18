import React, { forwardRef } from 'react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../../ui/NavigationMenu';

export type HeaderMenuProps = Omit<
  React.ComponentProps<typeof NavigationMenu>,
  'children'
> & {
  menuItems: { name: string; label: string; href: string; isActive: boolean }[];
  onMenuItemClick?: (name: string, href: string) => void;
};

export const HeaderMenu = forwardRef<
  React.ComponentRef<typeof NavigationMenu>,
  HeaderMenuProps
>(({ className, menuItems, onMenuItemClick, ...props }, ref) => {
  return (
    <NavigationMenu ref={ref} className={className} {...props}>
      <NavigationMenuList data-element-header-menu-list>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.name} data-element-header-menu-item>
            <NavigationMenuLink data-element-header-menu-link
              data-name={item.name}
              href={item.href}
              onClick={() => onMenuItemClick?.(item.name, item.href)}
              active={item.isActive}
              className={[
                'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background',
                'px-4 py-2 text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                'data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
              ].join(' ')}
            >
              {item.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
});

HeaderMenu.displayName = 'HeaderMenu';
