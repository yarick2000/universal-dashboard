import { GenericComponent as genericComponent } from '@/components/GenericComponent';
import { LoginControlsProps, LoginControls as LoginControlsUI } from '@/shadcn/components/LoginControls';

import { useLoginControls, UseLoginControlsProps } from './hooks/useLoginControls';

export function LoginControls(props: UseLoginControlsProps) {
  return genericComponent<LoginControlsProps, UseLoginControlsProps>({
    logic: useLoginControls,
    view: LoginControlsUI,
    ...props,
  });
};
