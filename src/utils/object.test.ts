import { getFlattenedObjectEntries, serializeError } from './object';

describe('getFlattenedObjectEntries', () => {
  it('flattens a simple object', () => {
    const obj = { a: 1, b: 2 };
    const result = Array.from(getFlattenedObjectEntries(obj));
    expect(result).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
  });

  it('flattens a nested object', () => {
    const obj = { a: { b: 2, c: 3 }, d: 4 };
    const result = Array.from(getFlattenedObjectEntries(obj));
    expect(result).toEqual([
      ['a.b', 2],
      ['a.c', 3],
      ['d', 4],
    ]);
  });

  it('handles empty object', () => {
    const obj = {};
    const result = Array.from(getFlattenedObjectEntries(obj));
    expect(result).toEqual([]);
  });

  it('handles null and array values', () => {
    const obj = { a: null, b: [1, 2], c: { d: null } };
    const result = Array.from(getFlattenedObjectEntries(obj));
    expect(result).toEqual([
      ['a', null],
      ['b', [1, 2]],
      ['c.d', null],
    ]);
  });

  it('uses prefix correctly', () => {
    const obj = { a: 1 };
    const result = Array.from(getFlattenedObjectEntries(obj, 'root'));
    expect(result).toEqual([
      ['root.a', 1],
    ]);
  });

  describe('serializeError', () => {
    it('serializes a standard Error object', () => {
      const error = new Error('Test error');
      const result = serializeError(error);
      expect(result).toHaveProperty('message', 'Test error');
      expect(result).toHaveProperty('name', 'Error');
      expect(result).toHaveProperty('stack');
    });

    it('serializes a custom error with additional properties', () => {
      class CustomError extends Error {
        code = 123;
        info = { detail: 'extra' };
      }
      const error = new CustomError('Custom error');
      const result = serializeError(error);
      expect(result).toHaveProperty('message', 'Custom error');
      expect(result).toHaveProperty('code', 123);
      expect(result).toHaveProperty('info');
      expect((result as CustomError).info).toEqual({ detail: 'extra' });
    });

    it('serializes a plain object', () => {
      const obj = { foo: 'bar', baz: 42 };
      const result = serializeError(obj);
      expect(result).toEqual({ foo: 'bar', baz: 42 });
    });

    it('serializes an object with non-enumerable properties', () => {
      const obj: unknown = {};
      Object.defineProperty(obj, 'hidden', {
        value: 'secret',
        enumerable: false,
        writable: true,
        configurable: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      (obj as any).visible = 'shown';
      const result = serializeError(obj);
      expect(result).toEqual({ hidden: 'secret', visible: 'shown' });
    });

    it('returns primitives unchanged', () => {
      expect(serializeError('string')).toBe('string');
      expect(serializeError(123)).toBe(123);
      expect(serializeError(null)).toBe(null);
      expect(serializeError(undefined)).toBe(undefined);
      expect(serializeError(true)).toBe(true);
    });
  });
});
