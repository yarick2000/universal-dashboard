import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import GoogleRecaptcha, { useRecaptcha } from '@/components/GoogleRecaptchaV3';
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
  // reCAPTCHA token state
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { getToken } = useRecaptcha(); // for fallback fetch during submit

  const onFormSubmit: SignupFormProps['onFormSubmit'] = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      void (async () => {
        let token = recaptchaToken;
        if (!token) {
          try {
            token = await getToken('signup');
            setRecaptchaToken(token);
          } catch {
            // TODO: handle reCAPTCHA failure (e.g., show an error message)
            return;
          }
        }
        // TODO: implement signup submit logic
      })();
    },
    [getToken, recaptchaToken],
  );

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
    captchaComponent: <GoogleRecaptcha onToken={setRecaptchaToken} action="signup" />, // Could integrate reCAPTCHA here
    onFormSubmit,
    onFirstNameChange,
    onLastNameChange,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
  };
}
