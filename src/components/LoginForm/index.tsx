import { GenericComponent as genericComponent } from '@/components/GenericComponent';
import { LoginForm as LoginFormUI, LoginFormProps } from '@/shadcn/components/LoginForm';

import { useLoginForm, UseLoginFormProps } from './hooks/useLoginForm';

export function LoginForm(props: UseLoginFormProps) {
  return genericComponent<LoginFormProps, UseLoginFormProps>({
    logic: useLoginForm,
    view: LoginFormUI,
    ...props,
  });
}
