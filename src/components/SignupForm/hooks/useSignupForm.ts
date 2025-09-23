import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import { SignupForm as SignupFormUI } from '@/shadcn/components/SignupForm';

// Re-export prop type inferred from UI component for consistency.
export type SignupFormProps = React.ComponentProps<typeof SignupFormUI>;

export type UseSignupFormProps = Omit<SignupFormProps,
  | 'generalError'
  | 'firstName'
  | 'firstNameLabel'
  | 'firstNamePlaceholder'
  | 'firstNameError'
  | 'lastName'
  | 'lastNameLabel'
  | 'lastNamePlaceholder'
  | 'lastNameError'
  | 'email'
  | 'emailLabel'
  | 'emailPlaceholder'
  | 'emailError'
  | 'password'
  | 'passwordLabel'
  | 'passwordPlaceholder'
  | 'passwordError'
  | 'confirmPassword'
  | 'confirmPasswordError'
  | 'confirmPasswordLabel'
  | 'confirmPasswordPlaceholder'
  | 'createAccountButtonText'
  | 'verificationLabel'
>;

export function useSignupForm(props: UseSignupFormProps): SignupFormProps {
  const { ...rest } = props;
  const t = useTranslations('components.signupForm');

  // Local state (could be lifted later or replaced with form library)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onFormSubmit: SignupFormProps['onFormSubmit'] = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: implement signup submit logic
  }, []);

  // Empty handlers that still update local state to keep fields controlled if needed
  const onFirstNameChange = useCallback((value: string) => {
    setFirstName(value);
    // TODO: side-effect for first name change
  }, []);
  const onLastNameChange = useCallback((value: string) => {
    setLastName(value);
  }, []);
  const onEmailChange = useCallback((value: string) => {
    setEmail(value);
  }, []);
  const onPasswordChange = useCallback((value: string) => {
    setPassword(value);
  }, []);
  const onConfirmPasswordChange = useCallback((value: string) => {
    setConfirmPassword(value);
  }, []);

  return {
    ...rest,
    generalError: undefined,
    firstName,
    firstNameLabel: t('firstNameLabel'),
    firstNamePlaceholder: t('firstNamePlaceholder'),
    firstNameError: undefined,
    lastName,
    lastNameLabel: t('lastNameLabel'),
    lastNamePlaceholder: t('lastNamePlaceholder'),
    lastNameError: undefined,
    email,
    emailLabel: t('emailLabel'),
    emailPlaceholder: t('emailPlaceholder'),
    emailError: undefined,
    password,
    passwordLabel: t('passwordLabel'),
    passwordPlaceholder: t('passwordPlaceholder'),
    passwordError: undefined,
    confirmPassword,
    confirmPasswordLabel: t('confirmPasswordLabel'),
    confirmPasswordPlaceholder: t('confirmPasswordPlaceholder'),
    confirmPasswordError: undefined,
    createAccountButtonText: t('createAccountButtonText'),
    verificationLabel: t('verificationLabel'),
    onFormSubmit,
    onFirstNameChange,
    onLastNameChange,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
  };
}
