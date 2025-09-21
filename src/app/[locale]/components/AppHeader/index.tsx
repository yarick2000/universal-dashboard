'use client';
import { HamburgerMenu } from '@/components/HamburgerMenu';
import { HeaderMenu } from '@/components/HeaderMenu';
import { HomeButton } from '@/components/HomeButton';
import { LoginControls } from '@/components/LoginControls';
import { SearchInput } from '@/components/SearchInput';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { WithAnonymous } from '@/layers/Authentication/components/WithAnonymous';

export function AppHeader() {
  return (
    <header
      className={[
        'sticky top-0 z-50 w-full border-b border-border/40',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      ].join(' ')}
    >
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Left aligned controls */}

        {/* Hamburger menu */}
        <div className="items-center gap-4 md:hidden">
          <HamburgerMenu />
        </div>
        <div className="hidden items-center gap-4 md:flex">
          {/* Home button */}
          <HomeButton />

          {/* Navigation menu */}
          <HeaderMenu />
        </div>

        {/* Right aligned controls */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Search documentation */}
          <SearchInput className="ice-[search-input]:w-36 sm:ice-[search-input]:w-64" />

          {/* Login controls */}
          <WithAnonymous><LoginControls /></WithAnonymous>

          {/* Theme switcher */}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
