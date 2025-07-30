export function *getFlattenedObjectEntries(obj: object, prefix: string = '', storeObjects: boolean = false): IterableIterator<[string, unknown]> {
  if (storeObjects && typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    yield [prefix, obj]; // Yield the object itself if not storing nested objects
    return;
  }
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      yield *getFlattenedObjectEntries(value as Record<string, unknown>, fullKey);
    } else {
      yield [fullKey, value];
    }
  }
};
