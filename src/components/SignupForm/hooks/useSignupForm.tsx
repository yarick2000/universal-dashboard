import { useCallback, useRef, useState } from 'react';

import { signUpAction } from '@/app/actions/user';
import { useRecaptcha } from '@/components/GoogleRecaptchaV3';
import { verifyRecaptchaTokenAction } from '@/components/GoogleRecaptchaV3/actions';
import { loggerService } from '@/index';
import { useLocalizations } from '@/layers/Internationalization/hooks/useLocalizations';
import { createLogger } from '@/layers/Logging/utils';
import { SignupForm as SignupFormUI } from '@/shadcn/components/SignupForm';
import { retryAsync } from '@/utils/execution';

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
  | 'cancelButtonText'
>;

// Password complexity: min 10 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/`~]).{10,}$/;

export function useSignupForm(props: UseSignupFormProps): SignupFormProps {
  const { ...rest } = props;
  const t = useLocalizations('components.signupForm');
  const logger = createLogger(loggerService, import.meta.url);

  // Local state (could be lifted later or replaced with form library)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Error states
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [generalError, setGeneralError] = useState<string | undefined>(undefined);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  // reCAPTCHA token state
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { getToken, getRecaptchaComponent } = useRecaptcha(); // for fallback fetch during submit

  const resetErrors = useCallback(() => {
    setGeneralError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setConfirmPasswordError(undefined);
  }, []);

  const handleRecaptchaVerification = useCallback(async (token: string, email: string) => {
    try {
      const {
        success,
        code,
        reason,
      } = await verifyRecaptchaTokenAction(token, 'signup');
      if (!success) {
        await logger.warn(`reCAPTCHA verification failed during signup for ${email}.`, {
          code,
          reason,
        });
        setRecaptchaToken(null);
        setGeneralError(t('errors.recaptchaFailed'));
      }
      return success;
    } catch (error) {
      await logger.error('Error during reCAPTCHA verification in signup', { error });
      setRecaptchaToken(null);
      setGeneralError(t('errors.generalErrorMessage'));
      return false;
    }
  }, [logger, t]);

  const handleSignup = useCallback(async (data: FormData) => {
    const emailValue = data.get('email') as string;
    const firstNameValue = data.get('firstName') as string;
    const lastNameValue = data.get('lastName') as string;
    const passwordValue = data.get('password') as string;
    const {
      success, code, reason,
    } = await signUpAction(
      emailValue,
      firstNameValue,
      lastNameValue,
      passwordValue,
    );
  }, []);

  const updateFormData = useCallback((data: FormData) => {
    const firstNameValue = data.get('firstName') as string;
    const lastNameValue = data.get('lastName') as string;
    const emailValue = data.get('email') as string;
    const passwordValue = data.get('password') as string;
    const confirmPasswordValue = data.get('confirmPassword') as string;
    setFirstName(firstNameValue);
    setLastName(lastNameValue);
    setEmail(emailValue);
    setPassword(passwordValue);
    setConfirmPassword(confirmPasswordValue);
  }, []);

  const onSignupEvent = useCallback(async (data: FormData) => {
    updateFormData(data);
    const emailValue = data.get('email') as string;
    const recaptchaTokenValue = data.get('recaptchaToken') as string;
    const recaptchaSuccess = await handleRecaptchaVerification(recaptchaTokenValue, emailValue);
    if (recaptchaSuccess) {
      await handleSignup(data);
    }
  }, [handleRecaptchaVerification, handleSignup, updateFormData]);

  const onFormSubmitEvent: SignupFormProps['onFormSubmit'] = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      // If we already have a token, allow natural submission (server action runs)
      if (recaptchaToken) return;
      // Otherwise block submission and obtain token
      e.preventDefault();

      resetErrors();

      void (async () => {
        let token: string | null = null;
        try {
          await retryAsync(async () => {
            token = await getToken('signup');
          });
          if (!token) {
            await logger.warn('Received empty reCAPTCHA token');
            setGeneralError(t('errors.generalErrorMessage'));
            return;
          }
          setRecaptchaToken(token);
          // Submit form programmatically (bypasses React onSubmit -> avoids loop)
          // Hidden input will be rendered on next paint with the token value.
          setTimeout(() => {
            if (formRef.current) formRef.current.requestSubmit();
          }, 0);
        } catch (error) {
          await logger.error('Failed to get reCAPTCHA token', error);
          setGeneralError(t('errors.generalErrorMessage'));
        }
      })();
    },
    [getToken, logger, recaptchaToken, resetErrors, t],
  );

  // Empty handlers that still update local state to keep fields controlled if needed
  const onFirstNameChangeEvent = useCallback((value: string) => {
    setFirstName(value);
  }, []);
  const onLastNameChangeEvent = useCallback((value: string) => {
    setLastName(value);
  }, []);
  const onEmailChangeEvent = useCallback((value: string) => {
    setEmail(value);
  }, []);
  const onPasswordChangeEvent = useCallback((value: string) => {
    setPassword(value);
    if (value && !PASSWORD_REGEX.test(value)) {
      setPasswordError(t('errors.passwordComplexity'));
    } else {
      setPasswordError(undefined);
    }
  }, [t]);
  const onConfirmPasswordChangeEvent = useCallback((value: string) => {
    setConfirmPassword(value);
    if (password && value !== password) {
      setConfirmPasswordError(t('errors.passwordsDoNotMatch'));
    } else {
      setConfirmPasswordError(undefined);
    }
  }, [password, t]);

  return {
    ...rest,
    generalError,
    formRef,
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
    emailError,
    password,
    passwordLabel: t('passwordLabel'),
    passwordPlaceholder: t('passwordPlaceholder'),
    passwordError,
    confirmPassword,
    confirmPasswordLabel: t('confirmPasswordLabel'),
    confirmPasswordPlaceholder: t('confirmPasswordPlaceholder'),
    confirmPasswordError,
    createAccountButtonText: t('createAccountButtonText'),
    verificationLabel: t('verificationLabel'),
    cancelButtonText: t('cancelButtonText'),
    captchaComponent: getRecaptchaComponent(recaptchaToken, 'recaptchaToken'),
    onSignup: onSignupEvent,
    onFormSubmit: onFormSubmitEvent,
    onFirstNameChange: onFirstNameChangeEvent,
    onLastNameChange: onLastNameChangeEvent,
    onEmailChange: onEmailChangeEvent,
    onPasswordChange: onPasswordChangeEvent,
    onConfirmPasswordChange: onConfirmPasswordChangeEvent,
  };
};
