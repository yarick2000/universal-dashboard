import { PropsWithChildren } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../../ui/Dialog';

type DialogWrapperProps = React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

export function DialogWrapper({
  title,
  description,
  isOpen,
  onClose,
  children,
}: PropsWithChildren<DialogWrapperProps>) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      data-element-dialog
    >
      <DialogContent
        className="sm:max-w-md [&>[data-slot=dialog-close]]:cursor-pointer"
        data-element-dialog-content
      >
        <DialogTitle
          data-element-dialog-title
        >
          {title}
        </DialogTitle>
        <DialogDescription data-element-dialog-description>{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
