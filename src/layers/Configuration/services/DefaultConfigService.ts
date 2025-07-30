import { getFlattenedObjectEntries } from '@/utils/object';

import { ConfigService } from '../interfaces';

export class DefaultConfigService implements ConfigService {
  private configMap: Map<string, unknown> = new Map<string, unknown>();
  private parent?: ConfigService;
  private parentPrefix: string = '';

  constructor(parent?: ConfigService, parentPrefix: string = '') {
    this.parent = parent;
    this.parentPrefix = parentPrefix;
  }

  get<T>(key: string, defaultValue?: T): T {
    if (this.has(key)) {
      return this.getInteral<T>(key, defaultValue);
    }
    return defaultValue as T;
  }

  getParentKey(key: string): string {
    if (this.parentPrefix) {
      return `${this.parentPrefix}.${key}`;
    }
    return key;
  }

  set<T>(key: string, value: T): void {
    this.configMap.set(key, value);
  }

  delete(key: string): void {
    if (this.configMap.has(key)) {
      this.configMap.delete(key);
    } else if (this.parent) {
      this.parent.delete(this.getParentKey(key));
    }
  }

  test(key: string): boolean {
    return Boolean(this.get(key, undefined));
  }

  testSome(keys: string[]): boolean {
    return keys.some(key => this.test(key));
  }

  testAll(keys: string[]): boolean {
    return keys.every(key => this.test(key));
  }

  partial(prefix: string): ConfigService {
    return new DefaultConfigService(this, prefix);
  }

  hasOwn(key: string): boolean {
    return this.configMap.has(key);
  }

  has(key: string): boolean {
    const hasKey = this.hasOwn(key);
    if (!hasKey && this.parent && this.parent.has(this.getParentKey(key))) {
      return true;
    }
    return hasKey;
  }

  hasSome(keys: string[]): boolean {
    return keys.some(key => this.has(key));
  }

  hasAll(keys: string[]): boolean {
    return keys.every(key => this.has(key));
  }

  toObject<T>(prefix?: string): T {
    const result: Record<string, unknown> = {};
    const keys = prefix ? Array.from(this.configMap.keys()).filter(k => k.startsWith(prefix)) : Array.from(this.configMap.keys());

    for (const key of keys) {
      result[key] = this.getInteral(key);
    }

    if (this.parent) {
      const parentObject = this.parent.toObject(this.getParentKey(prefix || ''));
      Object.assign(result, parentObject);
    }

    return result as T;
  }

  toJSON(prefix?: string): string {
    const obj = this.toObject(prefix);
    return JSON.stringify(obj, null, 2);
  }

  load(obj: object, topLevelKey?: string, override?: boolean): void {
    for (const [key, value] of getFlattenedObjectEntries(obj, topLevelKey, override)) {
      if (override || !this.has(key)) {
        this.set(key, value);
      }
    }
  }

  loadAsync(promise: Promise<object>, topLevelKey?: string, override?: boolean): Promise<void> {
    return promise.then(obj => {
      this.load(obj, topLevelKey, override);
    });
  }

  clear(): void {
    this.configMap.clear();
  }

  private getInteral<T>(key: string, defaultValue?: T): T {
    if (this.configMap.has(key)) {
      return this.configMap.get(key) as T;
    }
    const parentKey = this.getParentKey(key);
    if (this.parent && parentKey) {
      return this.parent.get<T>(parentKey, defaultValue);
    }
    return defaultValue as T;
  }
}
