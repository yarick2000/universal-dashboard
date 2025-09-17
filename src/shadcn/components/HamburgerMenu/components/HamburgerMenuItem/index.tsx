import clsx from 'clsx';

import { Button } from '../../../../ui/Button';
import { HamburgerMenuItem as HamburgerMenuItemData } from '../../types';

type HamburgerMenuItemProps = React.ComponentProps<typeof Button> & {
  data: HamburgerMenuItemData;
  showIconPlaceholder?: boolean;
};

export function HamburgerMenuItem(
  {
    data,
    className,
    onClick,
    showIconPlaceholder,
    ...props
  }: HamburgerMenuItemProps,
) {
  return (
    <Button
      variant="ghost"
      data-name={data.name}
      onClick={onClick}
      className={clsx('h-10 justify-start px-4', className)}
      {...props}
    >
      {data.type === 'link' ? (
        <a href={data.href} className="flex items-center" data-element-link>
          {!data.icon && showIconPlaceholder ? <span className="mr-2.5 w-4" /> : null}
          {data.icon}
          {data.label}
        </a>
      ) : (
        <>
          {!data.icon && showIconPlaceholder ? <span className="mr-2.5 w-4" /> : null}
          {data.icon}
          {data.label}
        </>
      )}
    </Button>
  );
}
