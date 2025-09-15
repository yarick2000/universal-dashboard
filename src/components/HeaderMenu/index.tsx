import { GenericComponent as genericComponent } from '@/components/GenericComponent';
import { HeaderMenu as HeaderMenuUI, HeaderMenuProps } from '@/shadcn/components/HeaderMenu';

import { useHeaderMenu, UseHeaderMenuProps } from './hooks/useHeaderMenu';

export function HeaderMenu(props: UseHeaderMenuProps) {
  return genericComponent<HeaderMenuProps, UseHeaderMenuProps>({
    logic: useHeaderMenu,
    view: HeaderMenuUI,
    ...props,
  });
}
