import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';

import { ThemeSwitcherProps } from '@/shadcn/components/ThemeSwitcher';

export function useThemeSwitcher(props: React.ComponentProps<'button'>) : ThemeSwitcherProps {
  const { theme, setTheme } = useTheme();
  const onThemeChange = useCallback((theme: string) => {
    setTheme(theme);
  }, [setTheme]);
  const themes = [
    { value: 'light', icon: <SunIcon data-element-icon /> },
    { value: 'dark', icon: <MoonIcon data-element-icon /> },
  ];

  return {
    ...props,
    themes,
    currentTheme: theme ?? 'light',
    onThemeChange,
  };
}
