'use client';

import { Button } from '../../ui/Button';
import { cn } from '../../utils';

import type React from 'react';

type SignupConfirmationProps = React.ComponentProps<'div'> & {
  titleText?: string;
  descriptionText?: string;
  buttonText?: string;
  onClose: () => void;
};

export function SignupConfirmation({
  className,
  onClose,
  titleText,
  descriptionText,
  buttonText,
  ...props
}: SignupConfirmationProps) {
  return (
    <div className={cn('space-y-6 py-8 text-center', className)} {...props}>
      <div className="space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900" data-element-title>{titleText}</h2>
          <p className="mt-2 text-gray-600" data-element-description>{descriptionText}</p>
        </div>
      </div>
      <Button onClick={onClose} className="w-full" data-element-button>
        {buttonText}
      </Button>
    </div>
  );
}
