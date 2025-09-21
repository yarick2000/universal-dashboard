import { useSession } from 'next-auth/react';

export function WithAnonymous({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  if (status === 'unauthenticated') {
    return <>{children}</>;
  }
  return null;
}
