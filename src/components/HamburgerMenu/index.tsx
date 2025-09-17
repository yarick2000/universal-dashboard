import { GenericComponent as genericComponent } from '@/components/GenericComponent';
import { HamburgerMenu as HamburgerMenuUI, HamburgerMenuProps } from '@/shadcn/components/HamburgerMenu';

import { useHamburgerMenu, UseHamburgerMenuProps } from './hooks/useHamburgerMenu';

export function HamburgerMenu(props: UseHamburgerMenuProps) {
  return genericComponent<HamburgerMenuProps, UseHamburgerMenuProps>({
    logic: useHamburgerMenu,
    view: HamburgerMenuUI,
    ...props,
  });
}
