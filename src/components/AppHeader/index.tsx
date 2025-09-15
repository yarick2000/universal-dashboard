'use client';

import { Home } from 'lucide-react';
import { useEffect } from 'react';

import { SearchInput } from '@/components/SearchInput';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Button } from '@/shadcn/ui/Button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/shadcn/ui/NavigationMenu';

import { LoginControls } from '../LoginControls';


export function AppHeader() {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const searchInput = document.getElementById('search-docs');
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full border-b border-border/40',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      ].join(' ')}
    >
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Left aligned controls */}
        <div className="flex items-center gap-4">
          {/* Home icon button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHomeClick}
            className="h-9 w-9"
            aria-label="Navigate to home page"
          >
            <Home className="h-4 w-4" />
          </Button>

          {/* Navigation menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/docs"
                  className={[
                    'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background',
                    'px-4 py-2 text-sm font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                    'disabled:pointer-events-none',
                    'disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
                  ].join(' ')}
                >
                  Docs
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/help"
                  className={[
                    'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background',
                    'px-4 py-2 text-sm font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                    'disabled:pointer-events-none disabled:opacity-50',
                    'data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
                  ].join(' ')}
                >
                  Help
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right aligned controls */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Search documentation */}
          <SearchInput />

          {/* Login controls */}
          <LoginControls />

          {/* Theme switcher */}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
