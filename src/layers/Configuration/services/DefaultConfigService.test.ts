import { DefaultConfigService } from './DefaultConfigService';

// Mock the getFlattenedObjectEntries utility
jest.mock('@/utils/object', () => ({
  getFlattenedObjectEntries: jest.fn((obj: object, topLevelKey?: string) => {
    const entries: [string, unknown][] = [];
    const prefix = topLevelKey ? `${topLevelKey}.` : '';

    function flatten(o: unknown, currentPrefix: string = '') {
      if (typeof o === 'object' && o !== null && !Array.isArray(o)) {
        for (const [key, value] of Object.entries(o)) {
          const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key;
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            flatten(value, fullKey);
          } else {
            entries.push([`${prefix}${fullKey}`, value]);
          }
        }
      }
    }

    flatten(obj);
    return entries;
  }),

}));

describe('DefaultConfigService', () => {
  let service: DefaultConfigService;

  beforeEach(() => {
    service = new DefaultConfigService();
  });

  describe('constructor', () => {
    it('should create instance without parent', () => {
      const config = new DefaultConfigService();
      expect(config).toBeInstanceOf(DefaultConfigService);
    });

    it('should create instance with parent and prefix', () => {
      const parent = new DefaultConfigService();
      const config = new DefaultConfigService(parent, 'test');
      expect(config).toBeInstanceOf(DefaultConfigService);
    });
  });

  describe('set and get', () => {
    it('should set and get string values', () => {
      service.set('key1', 'value1');
      expect(service.get('key1')).toBe('value1');
    });

    it('should set and get number values', () => {
      service.set('key2', 42);
      expect(service.get('key2')).toBe(42);
    });

    it('should return default value when key not found', () => {
      expect(service.get('nonexistent', 'default')).toBe('default');
    });

    it('should not override existing keys when setting', () => {
      service.set('key1', 'first');
      service.set('key1', 'second');
      expect(service.get('key1')).toBe('first');
    });
  });

  describe('getParentKey', () => {
    it('should return parent prefix when key is undefined', () => {
      const config = new DefaultConfigService(undefined, 'prefix');
      expect(config.getParentKey(undefined)).toBe('prefix');
    });

    it('should return key when no parent prefix', () => {
      expect(service.getParentKey('key')).toBe('key');
    });

    it('should return prefixed key when parent prefix exists', () => {
      const config = new DefaultConfigService(undefined, 'prefix');
      expect(config.getParentKey('key')).toBe('prefix.key');
    });
  });

  describe('delete', () => {
    it('should delete existing local key', () => {
      service.set('key1', 'value1');
      service.delete('key1');
      expect(service.hasOwn('key1')).toBe(false);
    });

    it('should delegate to parent when key not found locally', () => {
      const parent = new DefaultConfigService();
      const deleteSpy = jest.spyOn(parent, 'delete');
      const child = new DefaultConfigService(parent, 'child');

      child.delete('key1');
      expect(deleteSpy).toHaveBeenCalledWith('child.key1');
    });
  });

  describe('test methods', () => {
    beforeEach(() => {
      service.set('truthy', 'value');
      service.set('falsy', '');
      service.set('zero', 0);
      service.set('null', null);
    });

    it('should test single key truthiness', () => {
      expect(service.test('truthy')).toBe(true);
      expect(service.test('falsy')).toBe(false);
      expect(service.test('zero')).toBe(false);
      expect(service.test('null')).toBe(false);
      expect(service.test('nonexistent')).toBe(false);
    });

    it('should test some keys', () => {
      expect(service.testSome(['truthy', 'falsy'])).toBe(true);
      expect(service.testSome(['falsy', 'zero'])).toBe(false);
      expect(service.testSome(['nonexistent'])).toBe(false);
    });

    it('should test all keys', () => {
      expect(service.testAll(['truthy'])).toBe(true);
      expect(service.testAll(['truthy', 'falsy'])).toBe(false);
      expect(service.testAll(['falsy', 'zero'])).toBe(false);
    });
  });

  describe('createChildService', () => {
    it('should create child service with correct parent and prefix', () => {
      const child = service.createChildService('child');
      expect(child).toBeInstanceOf(DefaultConfigService);

      // Test that child can access parent values with prefix
      service.set('child.key', 'value');
      expect(child.get('key')).toBe('value');
    });
  });

  describe('hasOwn and has', () => {
    it('should check own keys', () => {
      service.set('key1', 'value1');
      expect(service.hasOwn('key1')).toBe(true);
      expect(service.hasOwn('nonexistent')).toBe(false);
    });

    it('should check keys in hierarchy', () => {
      const parent = new DefaultConfigService();
      parent.set('parent.key', 'value');
      const child = new DefaultConfigService(parent, 'parent');

      expect(child.has('key')).toBe(true);
      expect(child.has('nonexistent')).toBe(false);
    });

    it('should check some keys exist', () => {
      service.set('key1', 'value1');
      expect(service.hasSome(['key1', 'key2'])).toBe(true);
      expect(service.hasSome(['key2', 'key3'])).toBe(false);
    });

    it('should check all keys exist', () => {
      service.set('key1', 'value1');
      service.set('key2', 'value2');
      expect(service.hasAll(['key1', 'key2'])).toBe(true);
      expect(service.hasAll(['key1', 'key3'])).toBe(false);
    });
  });

  describe('toObject', () => {
    it('should convert to object without prefix', () => {
      service.set('key1', 'value1');
      service.set('key2', 'value2');

      const obj = service.toObject();
      expect(obj).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('should convert to object with prefix filter', () => {
      service.set('prefix.key1', 'value1');
      service.set('other.key2', 'value2');

      const obj = service.toObject('prefix');
      expect(obj).toEqual({ 'prefix.key1': 'value1' });
    });

    it('should include parent values', () => {
      const parent = new DefaultConfigService();
      parent.set('parent.key', 'parentValue');
      const child = new DefaultConfigService(parent, 'parent');
      child.set('childKey', 'childValue');

      const obj = child.toObject();
      expect(obj).toEqual({ childKey: 'childValue', 'parent.key': 'parentValue' });
    });
  });

  describe('toJSON', () => {
    it('should convert to formatted JSON', () => {
      service.set('key1', 'value1');
      const json = service.toJSON();
      expect(json).toBe(JSON.stringify({ key1: 'value1' }, null, 2));
    });

    it('should convert to compact JSON', () => {
      service.set('key1', 'value1');
      const json = service.toJSON(undefined, true);
      expect(json).toBe(JSON.stringify({ key1: 'value1' }));
    });
  });

  describe('load', () => {
    it('should load flat object', () => {
      const obj = { key1: 'value1', key2: 'value2' };
      service.load(obj);

      expect(service.get('key1')).toBe('value1');
      expect(service.get('key2')).toBe('value2');
    });

    it('should load with top level key', () => {
      const obj = { key1: 'value1' };
      service.load(obj, 'prefix');

      expect(service.get('prefix.key1')).toBe('value1');
    });

    it('should not override existing keys without override flag', () => {
      service.set('key1', 'original');
      service.load({ key1: 'new' });

      expect(service.get('key1')).toBe('original');
    });

    it('should override existing keys with override flag', () => {
      service.set('key1', 'original');
      service.load({ key1: 'new' }, undefined, true);

      expect(service.get('key1')).toBe('new');
    });
  });

  describe('loadAsync', () => {
    it('should load from promise', async () => {
      const promise = Promise.resolve({ key1: 'value1' });
      await service.loadAsync(promise);

      expect(service.get('key1')).toBe('value1');
    });

    it('should load from promise with options', async () => {
      const promise = Promise.resolve({ key1: 'value1' });
      await service.loadAsync(promise, 'prefix', true);

      expect(service.get('prefix.key1')).toBe('value1');
    });
  });

  describe('clear', () => {
    it('should clear all configuration', () => {
      service.set('key1', 'value1');
      service.set('key2', 'value2');

      service.clear();

      expect(service.hasOwn('key1')).toBe(false);
      expect(service.hasOwn('key2')).toBe(false);
    });
  });

  describe('hierarchical behavior', () => {
    it('should resolve values from parent with correct prefix', () => {
      const parent = new DefaultConfigService();
      parent.set('app.database.host', 'localhost');
      parent.set('app.database.port', 5432);

      const child = new DefaultConfigService(parent, 'app');

      expect(child.get('database.host')).toBe('localhost');
      expect(child.get('database.port')).toBe(5432);
    });

    it('should prioritize local values over parent values', () => {
      const parent = new DefaultConfigService();
      parent.set('app.key', 'parent-value');

      const child = new DefaultConfigService(parent, 'app');
      child.set('key', 'child-value');

      expect(child.get('key')).toBe('child-value');
    });
  });
});
