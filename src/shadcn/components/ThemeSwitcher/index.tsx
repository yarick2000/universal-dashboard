'use client';

import clsx from 'clsx';
import { ReactNode, useEffect, useState, forwardRef, useCallback } from 'react';

import { Button } from '@/shadcn/ui/Button';

type ThemeOption = {
  value: string;
  icon: ReactNode;
};

export type ThemeSwitcherProps = React.ComponentProps<'button'> & {
  themes: ThemeOption[];
  currentTheme: string;
  onThemeChange?: (theme: string) => void;
};

/**
 * ThemeSwitcher
 * Reusable button component to toggle between multiple themes.
 */
export const ThemeSwitcher = forwardRef<HTMLButtonElement, ThemeSwitcherProps>(
  ({ className, themes, currentTheme, onThemeChange, ...props }, ref) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const onClick = useCallback(() => {
      const currentIndex = themes.findIndex((theme) => theme.value === currentTheme);
      if (currentIndex === -1) return;
      const nextIndex = (currentIndex + 1) % themes.length;
      const nextTheme = themes[nextIndex].value;
      onThemeChange?.(nextTheme);
    }, [currentTheme, onThemeChange, themes]);

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        onClick={onClick}
        className={clsx('h-9 w-9', className)}
        {...props}
      >
        {mounted && (
          themes.map((theme) => (
            <span
              key={theme.value}
              className={clsx('absolute h-4 w-4 transition-all', {
                'scale-100 rotate-0': theme.value === currentTheme,
                'scale-0 rotate-90': theme.value !== currentTheme,
              })}
            >
              {theme.icon}
            </span>
          ))
        )}
      </Button>
    );
  },
);

ThemeSwitcher.displayName = 'ThemeSwitcher';
