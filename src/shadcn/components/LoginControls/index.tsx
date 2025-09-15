'use client';

import clsx from 'clsx';
import { forwardRef } from 'react';

import { Button } from '@/shadcn/ui/Button';

export type LoginControlsProps = React.ComponentProps<'div'> & {
  onLogin?: () => void;
  onSignup?: () => void;
  loginText?: string;
  signupText?: string;
};

export const LoginControls = forwardRef<HTMLDivElement, LoginControlsProps>(
  ({ className, onLogin, onSignup, loginText, signupText, ...props }, ref) => {
    return (
      <div className={clsx('flex items-center gap-2', className)} ref={ref} {...props}>
        <Button
          className="cursor-pointer"
          variant="ghost"
          size="sm"
          onClick={onLogin}
          data-element-login-button
        >
          {loginText || 'Sign In'}
        </Button>
        <Button className="cursor-pointer" size="sm" onClick={onSignup} data-element-signup-button>
          {signupText || 'Sign Up'}
        </Button>
      </div>
    );
  },
);
LoginControls.displayName = 'LoginControls';
