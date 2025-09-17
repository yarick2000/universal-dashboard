import clsx from 'clsx';
import { Home } from 'lucide-react';
import { forwardRef } from 'react';

import { Button, ButtonProps } from '@/shadcn/ui/Button';

export type HomeButtonProps = Omit<ButtonProps, 'onClick'> & {
  onNavigateHome?: () => void;
};

export const HomeButton = forwardRef<HTMLButtonElement, HomeButtonProps>(
  ({ onNavigateHome, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        onClick={onNavigateHome}
        className={clsx('h-9 w-9', className)}
        {...props}
      >
        <Home className="h-4 w-4" data-element-icon />
      </Button>
    );
  },
);

HomeButton.displayName = 'HomeButton';
