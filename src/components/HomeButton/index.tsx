import { GenericComponent as genericComponent } from '@/components/GenericComponent';
import { HomeButton as HomeButtonUI, HomeButtonProps } from '@/shadcn/components/HomeButton';

import { useHomeButton, UseHomeButtonProps } from './hooks/useHomeButton';

export function HomeButton(props: UseHomeButtonProps) {
  return genericComponent<HomeButtonProps, UseHomeButtonProps>({
    logic: useHomeButton,
    view: HomeButtonUI,
    ...props,
  });
}
