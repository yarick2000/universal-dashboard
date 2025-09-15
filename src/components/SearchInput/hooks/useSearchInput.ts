import { useTranslations } from 'next-intl';
import { useCallback, useRef } from 'react';

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
  const t = useTranslations('components.searchInput');

  const onSearch: SearchInputUIProps['onSearch'] = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputEl = e.currentTarget.querySelector<HTMLInputElement>('[data-element-search-input]');
    const value = inputEl?.value?.trim() || '';
    lastSubmitted.current = value;
    // Future: dispatch search request
  }, []);

  return {
    ...rest,
    onSearch,
    shortcutHint,
    placeholder: placeholder || t('placeholder'),
  };
}
