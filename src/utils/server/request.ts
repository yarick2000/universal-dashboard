import { headers } from 'next/headers';

export async function getIpFromHeaders(): Promise<string> {
  const currentHeaders = await headers();
  return (
    currentHeaders.get('x-original-forwarded-for') ||
    currentHeaders.get('x-forwarded-for') ||
    '127.0.0.1'
  );
}
