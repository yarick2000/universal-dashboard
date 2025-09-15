import { GenericComponent as genericComponent } from '@/components/GenericComponent';
import { ThemeSwitcherProps, ThemeSwitcher as ThemeSwitcherUI } from '@/shadcn/components/ThemeSwitcher';

import { useThemeSwitcher } from './hooks/useThemeSwitcher';

export function ThemeSwitcher(props: React.ComponentProps<'button'>) {
  return genericComponent<ThemeSwitcherProps, React.ComponentProps<'button'>>({
    logic: useThemeSwitcher,
    view: ThemeSwitcherUI,
    ...props,
  });
}
