'use client';

import { Home } from 'lucide-react';

import { SearchInput } from '@/components/SearchInput';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Button } from '@/shadcn/ui/Button';

import { HeaderMenu } from '../HeaderMenu';
import { LoginControls } from '../LoginControls';


export function AppHeader() {

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
          <HeaderMenu />
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
