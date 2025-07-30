export interface ConfigService {
  get<T>(key: string, defaultValue?: T): T;
  getParentKey(key: string): string;
  set<T>(key: string, value: T): void;
  delete(key: string): void;
  test(key: string): boolean;
  testSome(keys: string[]): boolean;
  testAll(keys: string[]): boolean;
  partial(prefix: string): ConfigService;
  hasOwn(key: string): boolean;
  has(key: string): boolean;
  hasAll(keys: string[]): boolean;
  toObject<T>(prefix?: string): T;
  toJSON(prefix?: string): string;
  load(obj: object, topLevelKey?: string, override?: boolean): void;
  loadAsync(promise: Promise<object>, topLevelKey?: string, override?: boolean): Promise<void>;
  clear(): void;
};
