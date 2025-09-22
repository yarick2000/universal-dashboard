import { useCallback, useEffect, useRef } from 'react';

import { useLocalizations } from '@/layers/Internationalization/hooks/useLocalizations';
import { SearchInputProps as SearchInputUIProps } from '@/shadcn/components/SearchInput';

export type UseSearchInputProps = React.ComponentProps<'form'> & {
  /** Optional initial value for search */
  initialQuery?: string;
  /** Placeholder override */
  placeholder?: string;
  /** Keyboard shortcut hint override */
  shortcutHint?: string;
};

export function useSearchInput(props: UseSearchInputProps): SearchInputUIProps {
  const { initialQuery = '', placeholder, shortcutHint, ...rest } = props;
  const lastSubmitted = useRef<string>(initialQuery);
  const t = useLocalizations('components.searchInput');

  const onSearch: SearchInputUIProps['onSearch'] = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputEl = e.currentTarget.querySelector<HTMLInputElement>('[data-element-search-input]');
    const value = inputEl?.value?.trim() || '';
    lastSubmitted.current = value;
    // Future: dispatch search request
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('[data-element-search-input]');
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    ...rest,
    onSearch,
    shortcutHint,
    placeholder: placeholder || t('placeholder'),
  };
}
