'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { LoginForm as LoginFormComponent } from '@/components/LoginForm';
import { WindowMessageTypes } from '@/enums';
import { useWindowMessage } from '@/hooks/useWindowMessage';
import { DialogWrapper } from '@/shadcn/components/DialogWrapper';

export function LoginForm() {
  const t = useTranslations('components.loginForm');
  const [isOpen, setIsOpen] = useState(false);
  useWindowMessage(
    [WindowMessageTypes.ShowLoginForm, WindowMessageTypes.HideLoginForm],
    ({type}: {type: WindowMessageTypes}) => {
      if (type === WindowMessageTypes.ShowLoginForm) {
        setIsOpen(true);
      } else if (type === WindowMessageTypes.HideLoginForm) {
        setIsOpen(false);
      }
    });
  return (
    <DialogWrapper
      isOpen={isOpen}
      title={t('title')}
      description={t('description')}
      onClose={() => setIsOpen(false)}
    >
      <LoginFormComponent />
    </DialogWrapper>
  );
}
