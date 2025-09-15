import { GenericComponent as genericComponent } from '@/components/GenericComponent';
import { LoginControlsProps, LoginControls as LoginControlsUI } from '@/shadcn/components/LoginControls';

import { useLoginControls } from './hooks/useLoginControls';

export function LoginControls(props: React.ComponentProps<'div'>) {
  return genericComponent<LoginControlsProps, React.ComponentProps<'div'>>({
    logic: useLoginControls,
    view: LoginControlsUI,
    ...props,
  });
};
