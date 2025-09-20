import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/Dialog';

export type WithDialogProps = {
  dialogTitle?: string;
  dialogDescription?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

export function withDialogHoc<P extends object>(
  Component: React.FC<P>,
): React.FC<P & WithDialogProps> {
  return function WithDialogComponent({
    dialogTitle,
    dialogDescription,
    isOpen,
    onClose,
    ...props
  }) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose} data-element-dialog>
        <DialogTitle data-element-dialog-title>{dialogTitle}</DialogTitle>
        <DialogDescription data-element-dialog-description>{dialogDescription}</DialogDescription>
        <DialogContent data-element-dialog-content>
          <Component {...(props as P)} />
        </DialogContent>
      </Dialog>
    );
  };
}
