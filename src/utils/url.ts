export function buildUrl(url: string, params?: Record<string, unknown>, base?: string) {
  if (!params) return url;
  const urlObj = new URL(url, base || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost');
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.append(key, String(value));
  });
  return urlObj.toString();
}
