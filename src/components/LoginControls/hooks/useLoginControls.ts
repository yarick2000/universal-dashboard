import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { signInAction } from '@/app/actions';
import { LoginControlsProps } from '@/shadcn/components/LoginControls';

export function useLoginControls(props: React.ComponentProps<'div'>) : LoginControlsProps {
  const t = useTranslations('components.loginControls');
  const locale = useLocale();
  const router = useRouter();
  const onLogin = useCallback(() => {
    // Handle login logic
    void signInAction();
  }, []);
  const onSignup = useCallback(() => {
    // Navigate to signup page
    router.push(`${locale}/auth/signup`);
  }, [locale, router]);
  return {
    ...props,
    onLogin,
    onSignup,
    loginText: t('login'),
    signupText: t('signup'),
  } as LoginControlsProps;
};

