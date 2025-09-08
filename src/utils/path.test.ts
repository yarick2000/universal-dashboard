import { fileURLToPath , baseName } from './path';


describe('fileURLToPath', () => {
  const originalPlatform = process.platform;

  afterEach(() => {
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    });
  });

  it('throws TypeError for invalid argument', () => {
    // @ts-expect-error Checking runtime type error
    expect(() => fileURLToPath(123)).toThrow(TypeError);
    // @ts-expect-error Checking runtime type error
    expect(() => fileURLToPath({})).toThrow(TypeError);
  });

  it('converts file URL to POSIX path', () => {
    Object.defineProperty(process, 'platform', { value: 'linux' });
    const url = new URL('file:///home/user/file.txt');
    expect(fileURLToPath(url)).toBe('/home/user/file.txt');
  });

  it('decodes special characters in POSIX path', () => {
    Object.defineProperty(process, 'platform', { value: 'darwin' });
    const url = new URL('file:///home/user/My%20File.txt');
    expect(fileURLToPath(url)).toBe('/home/user/My File.txt');
  });

  it('converts file URL to Windows path', () => {
    Object.defineProperty(process, 'platform', { value: 'win32' });
    const url = new URL('file:///C:/Users/test/file.txt');
    expect(fileURLToPath(url)).toBe('C:\\Users\\test\\file.txt');
  });

  it('decodes special characters in Windows path', () => {
    Object.defineProperty(process, 'platform', { value: 'win32' });
    const url = new URL('file:///C:/Users/test/My%20File.txt');
    expect(fileURLToPath(url)).toBe('C:\\Users\\test\\My File.txt');
  });

  describe('baseName', () => {
    it('returns empty string for empty input', () => {
      expect(baseName('')).toBe('');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      expect(baseName(undefined as any)).toBe('');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      expect(baseName(null as any)).toBe('');
    });

    it('returns basename for POSIX paths', () => {
      expect(baseName('/home/user/file.txt')).toBe('file.txt');
      expect(baseName('/home/user/dir/')).toBe('dir');
      expect(baseName('file.txt')).toBe('file.txt');
      expect(baseName('/file.txt')).toBe('file.txt');
    });

    it('returns basename for Windows paths', () => {
      expect(baseName('C:\\Users\\test\\file.txt')).toBe('file.txt');
      expect(baseName('C:\\Users\\test\\dir\\')).toBe('dir');
      expect(baseName('file.txt')).toBe('file.txt');
      expect(baseName('C:/Users/test/file.txt')).toBe('file.txt');
    });

    it('returns basename for URLs', () => {
      expect(baseName('http://example.com/file.txt')).toBe('file.txt');
      expect(baseName('https://example.com/dir/file.txt')).toBe('file.txt');
      expect(baseName('file:///C:/Users/test/file.txt')).toBe('file.txt');
      expect(baseName('file:///home/user/file.txt')).toBe('file.txt');
    });

    it('decodes special characters in URLs', () => {
      expect(baseName('http://example.com/My%20File.txt')).toBe('My File.txt');
      expect(baseName('file:///home/user/My%20File.txt')).toBe('My File.txt');
      expect(baseName('file:///C:/Users/test/My%20File.txt')).toBe('My File.txt');
    });

    it('strips extension if provided (case-insensitive)', () => {
      expect(baseName('/home/user/file.txt', '.txt')).toBe('file');
      expect(baseName('C:\\Users\\test\\file.TXT', '.txt')).toBe('file');
      expect(baseName('file.txt', 'txt')).toBe('file');
      expect(baseName('file.Ts', '.ts')).toBe('file');
      expect(baseName('file.tsx', '.tsx')).toBe('file');
      expect(baseName('file.tsx', 'tsx')).toBe('file');
    });

    it('does not strip extension if it does not match', () => {
      expect(baseName('file.txt', '.js')).toBe('file.txt');
      expect(baseName('file.txt', 'js')).toBe('file.txt');
      expect(baseName('file.txt', '.TXT2')).toBe('file.txt');
    });

    it('handles paths with multiple dots', () => {
      expect(baseName('/home/user/file.test.txt', '.txt')).toBe('file.test');
      expect(baseName('C:\\Users\\test\\file.test.txt', '.txt')).toBe('file.test');
    });

    it('handles trailing slashes', () => {
      expect(baseName('/home/user/dir/')).toBe('dir');
      expect(baseName('C:\\Users\\test\\dir\\')).toBe('dir');
      expect(baseName('http://example.com/dir/')).toBe('dir');
    });
  });
});
