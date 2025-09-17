export type HamburgerMenuItem = {
  icon?: React.ReactNode;
  name: string;
  label: string;
  href?: string;
  isActive?: boolean;
  type: 'link' | 'button';
};
