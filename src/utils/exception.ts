export function withTryCatch<T>(fn: () => T, errorHandler?: (error: Error) => void): T | undefined {
  try {
    return fn();
  } catch (error) {
    if (error instanceof Error) {
      if (errorHandler) {
        errorHandler(error);
      }
    }
    return undefined;
  }
};
