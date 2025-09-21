import { useSession } from 'next-auth/react';

export function WithAuthenticated({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  if (status === 'authenticated') {
    return <>{children}</>;
  }
  return null;
}
