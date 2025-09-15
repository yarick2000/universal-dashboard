'use client';

import { Command, Home, Search } from 'lucide-react';
import { useEffect } from 'react';

import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Button } from '@/shadcn/ui/Button';
import { Input } from '@/shadcn/ui/Input';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/shadcn/ui/NavigationMenu';

import { LoginControls } from '../LoginControls';

import type React from 'react';

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
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
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-docs"
                type="search"
                placeholder="Search documentation..."
                className="h-9 w-64 pr-12 pl-8"
              />
              <div className="absolute right-2.5 flex items-center gap-1">
                <kbd
                  className={[
                    'pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5',
                    'font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none',
                  ].join(' ')}
                >
                  <Command className="h-3 w-3" />S
                </kbd>
              </div>
            </div>
          </form>

          {/* Login controls */}
          <LoginControls />

          {/* Theme switcher */}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
