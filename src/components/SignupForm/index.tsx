import { GenericComponent as genericComponent } from '@/components/GenericComponent';
import { SignupForm as SignupFormUI } from '@/shadcn/components/SignupForm';

import { useSignupForm, SignupFormProps, UseSignupFormProps } from './hooks/useSignupForm';

export function SignupForm(props: UseSignupFormProps) {
  return genericComponent<SignupFormProps, UseSignupFormProps>({
    logic: useSignupForm,
    view: SignupFormUI,
    ...props,
  });
}
