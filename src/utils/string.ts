export function replaceFirst(
  str: string,
  search: string,
  replacement: string,
): string {
  const index = str.indexOf(search);
  if (index === -1) return str;
  return str.slice(0, index) + replacement + str.slice(index + search.length);
}
