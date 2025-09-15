import clsx from 'clsx';
import { Command, Search } from 'lucide-react';
import { forwardRef } from 'react';

import { Input } from '../../ui/Input';

export type SearchInputProps = React.ComponentProps<'form'> & {
  onSearch?: React.FormEventHandler<HTMLFormElement>;
  placeholder?: string;
  shortcutHint?: string;
};

export const SearchInput = forwardRef<HTMLFormElement, SearchInputProps>(
  ({ onSearch, placeholder, className, shortcutHint, ...props }, ref) => {
    return (
      <form onSubmit={onSearch} className={clsx('relative', className)} ref={ref} {...props}>
        <div className="relative flex items-center" data-element-search-input-container>
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" data-element-search-icon />
          <Input
            id="search-docs"
            type="search"
            placeholder={placeholder || 'Search documentation...'}
            className="h-9 w-64 pr-12 pl-8"
            data-element-search-input
          />
          <div className="absolute right-2.5 flex items-center gap-1" data-element-shortcut-hint>
            <kbd
              className={[
                'pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5',
                'font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none',
              ].join(' ')}
              data-element-keyboard-key
            >
              <Command className="h-3 w-3" data-element-command-icon />
              {shortcutHint && <span>{shortcutHint || 'S'}</span>}
            </kbd>
          </div>
        </div>
      </form>
    );
  },
);

SearchInput.displayName = 'SearchInput';
