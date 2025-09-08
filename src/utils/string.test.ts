import { replaceFirst } from './string';

describe('replaceFirst', () => {
  it('replaces the first occurrence of a substring', () => {
    expect(replaceFirst('foo bar foo', 'foo', 'baz')).toBe('baz bar foo');
  });

  it('returns the original string if substring is not found', () => {
    expect(replaceFirst('hello world', 'test', 'sample')).toBe('hello world');
  });

  it('replaces at the start of the string', () => {
    expect(replaceFirst('abc def', 'abc', 'xyz')).toBe('xyz def');
  });

  it('replaces at the end of the string', () => {
    expect(replaceFirst('def abc', 'abc', 'xyz')).toBe('def xyz');
  });

  it('works with empty search string (should insert replacement at start)', () => {
    expect(replaceFirst('hello', '', 'X')).toBe('Xhello');
  });

  it('works with empty replacement string', () => {
    expect(replaceFirst('foo bar foo', 'foo', '')).toBe(' bar foo');
  });

  it('works with empty input string', () => {
    expect(replaceFirst('', 'foo', 'bar')).toBe('');
  });

  it('is case sensitive', () => {
    expect(replaceFirst('Foo foo', 'foo', 'bar')).toBe('Foo bar');
  });
});