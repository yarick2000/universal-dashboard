import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu';
import React, { forwardRef } from 'react';

export type HeaderMenuProps = Omit<
  React.ComponentProps<typeof NavigationMenu>,
  'children'
> & {
  menuItems: { name: string; label: string; href: string; active: boolean }[];
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
              href={item.href}
              onClick={() => onMenuItemClick?.(item.name, item.href)}
              active={item.active}
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
