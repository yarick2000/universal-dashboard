import { Menu, X } from 'lucide-react';

import { Button } from '../../ui/Button';

import { HamburgerMenuItem } from './components/HamburgerMenuItem';
import { type HamburgerMenuItem as HamburgerMenuItemData } from './types';

export type HamburgerMenuProps = Omit<
  React.ComponentProps<'div'>,
  'children'
> & {
  isOpen: boolean;
  menuItems?: HamburgerMenuItemData[];
  onToggle: () => void;
  onMenuItemClick?: (name: string, href?: string) => void;
  hamburgerLabel?: string;
};

export function HamburgerMenu({
  className,
  isOpen,
  menuItems,
  hamburgerLabel,
  onToggle,
  onMenuItemClick,
}: HamburgerMenuProps) {
  const showIconPlaceholder = menuItems?.some((item) => !!item.icon) ?? false;
  return (
    <div className={className}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="h-9 w-9"
        aria-label={hamburgerLabel ?? 'Toggle hamburger menu'}
        data-element-menu-toggle
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      {isOpen && (
        <div
          className={[
            'absolute w-dvw mt-2.5',
            'border-t border-b border-border/90',
            'bg-background/90 backdrop-blur',
            'supports-[backdrop-filter]:bg-background/90',
          ].join(' ')}
        >
          <div className="container py-4" data-element-menu-container>
            <nav className="flex flex-col gap-2.5" data-element-menu>
              {menuItems?.map((item) => (
                <HamburgerMenuItem
                  key={item.name}
                  data={item}
                  onClick={() => onMenuItemClick?.(item.name, item.href)}
                  showIconPlaceholder={showIconPlaceholder}
                  data-element-menu-item
                />
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

HamburgerMenu.displayName = 'HamburgerMenu';
