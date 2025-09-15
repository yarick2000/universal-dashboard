import { GenericComponent as genericComponent } from '@/components/GenericComponent';
import { SearchInput as SearchInputUI, SearchInputProps } from '@/shadcn/components/SearchInput';

import { useSearchInput, UseSearchInputProps } from './hooks/useSearchInput';

export function SearchInput(props: UseSearchInputProps) {
  return genericComponent<SearchInputProps, UseSearchInputProps>({
    logic: useSearchInput,
    view: SearchInputUI,
    ...props,
  });
}
