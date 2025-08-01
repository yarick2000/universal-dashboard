import { getFlattenedObjectEntries } from '@/utils/object';

import { ConfigService } from '../interfaces';

/**
 * Default implementation of the ConfigService interface that provides hierarchical configuration management.
 * Supports parent-child relationships with prefixed keys and various configuration operations.
 */
export class DefaultConfigService implements ConfigService {
  /**
   * Internal map storing configuration key-value pairs.
   */
  private configMap: Map<string, unknown> = new Map<string, unknown>();

  /**
   * Optional parent configuration service for hierarchical lookups.
   */
  private parent?: ConfigService;

  /**
   * Prefix to apply when accessing parent configuration keys.
   */
  private parentPrefix: string = '';

  /**
   * Creates a new DefaultConfigService instance.
   * @param parent - Optional parent configuration service. If `undefined`, the service operates independently without a parent.
   * @param parentPrefix - Prefix to use when accessing parent keys (default: '')
   */
  constructor(parent?: ConfigService, parentPrefix: string = '') {
    this.parent = parent;
    this.parentPrefix = parentPrefix;
  }

  /**
   * Retrieves a configuration value by key.
   * @template T - The expected return type
   * @param key - The configuration key to retrieve
   * @param defaultValue - Default value to return if key is not found
   * @returns The configuration value or default value
   */
  get<T>(key: string, defaultValue?: T): T {
    if (this.has(key)) {
      return this.getInternal<T>(key, defaultValue);
    }
    return defaultValue as T;
  }

  /**
   * Constructs a parent key by applying the parent prefix.
   * @param key - The base key
   * @returns The prefixed key for parent lookup
   */
  getParentKey(key: string | undefined): string {
    if (!key) {
      return this.parentPrefix; // Return parentPrefix if key is undefined
    }
    if (this.parentPrefix) {
      return `${this.parentPrefix}.${key}`;
    }
    return key;
  }

  /**
   * Sets a configuration value.
   * @template T - The type of the value being set
   * @param key - The configuration key
   * @param value - The value to set
   * @param override - Whether to override existing keys (default: false)
   */
  set<T>(key: string, value: T, override?: boolean): void {
    if (!this.configMap.has(key) || override) {
      this.configMap.set(key, value);
    }
  }

  /**
   * Deletes a configuration key from this service or parent if not found locally.
   * @param key - The configuration key to delete
   */
  delete(key: string): void {
    if (this.configMap.has(key)) {
      this.configMap.delete(key);
    } else if (this.parent) {
      this.parent.delete(this.getParentKey(key));
    }
  }
  /**
   * Tests if a configuration key has a truthy value.
   * @param key - The configuration key to test
   * @returns True if the key exists and has a truthy value
   */
  test(key: string): boolean {
    return Boolean(this.get(key));
  }

  /**
   * Tests if any of the provided keys have truthy values.
   * @param keys - Array of configuration keys to test
   * @returns True if at least one key has a truthy value
   */
  testSome(keys: string[]): boolean {
    return keys.some(key => this.test(key));
  }

  /**
   * Tests if all of the provided keys have truthy values.
   * @param keys - Array of configuration keys to test
   * @returns True if all keys have truthy values
   */
  testAll(keys: string[]): boolean {
    return keys.every(key => this.test(key));
  }

  /**
   * Creates a new ConfigService instance with this service as parent and the specified prefix.
   * @param prefix - The prefix to use for the new child service
   * @returns A new ConfigService instance
   */
  createChildService(prefix: string): ConfigService {
    return new DefaultConfigService(this, prefix);
  }

  /**
   * Checks if a key exists in this service's own configuration map.
   * @param key - The configuration key to check
   * @returns True if the key exists in this service's map
   */
  hasOwn(key: string): boolean {
    return this.configMap.has(key);
  }

  /**
   * Checks if a key exists in this service or its parent hierarchy.
   * @param key - The configuration key to check
   * @returns True if the key exists in this service or parent
   */
  has(key: string): boolean {
    const hasKey = this.hasOwn(key);
    if (!hasKey && this.parent && this.parent.has(this.getParentKey(key))) {
      return true;
    }
    return hasKey;
  }

  /**
   * Checks if any of the provided keys exist in the configuration.
   * @param keys - Array of configuration keys to check
   * @returns True if at least one key exists
   */
  hasSome(keys: string[]): boolean {
    return keys.some(key => this.has(key));
  }

  /**
   * Checks if all of the provided keys exist in the configuration.
   * @param keys - Array of configuration keys to check
   * @returns True if all keys exist
   */
  hasAll(keys: string[]): boolean {
    return keys.every(key => this.has(key));
  }

  /**
   * Converts the configuration to a plain object, optionally filtered by prefix.
   * @template T - The expected return type
   * @param prefix - Optional prefix to filter keys
   * @returns The configuration as a plain object
   */
  toObject<T>(prefix?: string): T {
    const result: Record<string, unknown> = {};
    const keys = prefix ? Array.from(this.configMap.keys()).filter(k => k.startsWith(prefix)) : Array.from(this.configMap.keys());

    for (const key of keys) {
      result[key] = this.getInternal(key);
    }

    if (this.parent) {
      const parentObject = this.parent.toObject(this.getParentKey(prefix || ''));
      Object.assign(result, parentObject);
    }

    return result as T;
  }

  /**
   * Converts the configuration to a JSON string, optionally filtered by prefix.
   * @param prefix - Optional prefix to filter keys
   * @param compact - Whether to format the JSON compactly (default: false)
   * @returns The configuration as a JSON string
   */
  toJSON(prefix?: string, compact: boolean = false): string {
    const obj = this.toObject(prefix);
    return compact ? JSON.stringify(obj) : JSON.stringify(obj, null, 2);
  }

  /**
   * Loads configuration from an object, optionally under a top-level key.
   * @param obj - The object containing configuration data
   * @param topLevelKey - Optional top-level key to nest the configuration under
   * @param override - Whether to override existing keys (default: false)
   */
  load(obj: object, topLevelKey?: string, override?: boolean): void {
    const entries = getFlattenedObjectEntries(obj, topLevelKey, override);
    if (!entries) {
      return; // No entries to load
    }
    for (const [key, value] of entries) {
      if (override || !this.has(key)) {
        this.set(key, value, override);
      }
    }
  }

  /**
   * Asynchronously loads configuration from a promise that resolves to an object.
   * @param promise - Promise that resolves to an object containing configuration data
   * @param topLevelKey - Optional top-level key to nest the configuration under
   * @param override - Whether to override existing keys (default: false)
   * @returns Promise that resolves when loading is complete
   */
  loadAsync(promise: Promise<object>, topLevelKey?: string, override?: boolean): Promise<void> {
    return promise.then(obj => {
      this.load(obj, topLevelKey, override);
    });
  }

  /**
   * Clears all configuration data from this service's map.
   */
  /**
   * Clears all configuration data from this service's map.
   * This effectively resets the service to an empty state.
   */
  clear(): void {
    this.configMap.clear();
  }

  /**
   * Internal method to retrieve a configuration value, with fallback to the parent configuration service if the key is not found locally.
   * This method is used internally by the `get` method and other operations to ensure hierarchical configuration lookup.
   * It first checks the local configuration map, and if the key is not found, it delegates the lookup to the parent service using the prefixed key.
   * @template T - The expected return type
   * @param key - The configuration key to retrieve
   * @param defaultValue - Default value to return if the key is not found
   * @returns The configuration value or default value
   * @private
   */
  private getInternal<T>(key: string, defaultValue?: T): T {
    if (this.configMap.has(key)) {
      return this.configMap.get(key) as T;
    }
    if (this.parent) {
      const parentKey = this.getParentKey(key);
      return this.parent.get<T>(parentKey, defaultValue);
    }
    return defaultValue as T;
  }
}
