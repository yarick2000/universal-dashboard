import { serializeError as externalSerializeError } from 'serialize-error';

export function* getFlattenedObjectEntries(
  obj: object,
  prefix: string = '',
  storeObjects: boolean = false,
): IterableIterator<[string, unknown]> {
  if (storeObjects && typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    yield [prefix, obj]; // Yield the object itself if not storing nested objects
    return;
  }
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      yield* getFlattenedObjectEntries(value as Record<string, unknown>, fullKey);
    } else {
      yield [fullKey, value];
    }
  }
}

export function serializeError(error: unknown): unknown {
  if (error instanceof Error) {
    return externalSerializeError(error);
  }
  if (typeof error === 'object' && error !== null) {
    // Handle other error-like objects
    return JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
  }
  return error;
}
