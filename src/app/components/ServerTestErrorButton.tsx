'use client';

import { testError } from '@app/actions/test';

export function ServerTestErrorButton() {

  return (
    <button
      className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full border
        border-solid border-black/[.08] px-4 text-sm font-medium transition-colors
        hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:w-auto sm:px-5 sm:text-base md:w-[158px]
        dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={async () => await testError()}
    >
      Server error
    </button>
  );
};
