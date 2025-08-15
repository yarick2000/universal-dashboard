/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { isClient, isServer } from './system';

describe('system utilities', () => {
  const originalWindow = global.window;
  const originalProcess = global.process;

  afterEach(() => {
    global.window = originalWindow;
    global.process = originalProcess;
  });

  describe('isServer', () => {
    it('should return true when window is undefined and NEXT_RUNTIME is nodejs', () => {
      delete (global as any).window;
      global.process = { env: { NEXT_RUNTIME: 'nodejs' } } as any;
      expect(isServer()).toBe(true);
    });

    it('should return true when window is undefined and NEXT_RUNTIME is edge', () => {
      delete (global as any).window;
      global.process = { env: { NEXT_RUNTIME: 'edge' } } as any;
      expect(isServer()).toBe(true);
    });

    it('should return false when window is defined', () => {
      global.window = { document: {} } as any;
      global.process = { env: { NEXT_RUNTIME: 'nodejs' } } as any;
      expect(isServer()).toBe(false);
    });

    it('should return false when NEXT_RUNTIME is not nodejs or edge', () => {
      delete (global as any).window;
      global.process = { env: { NEXT_RUNTIME: 'other' } } as any;
      expect(isServer()).toBe(false);
    });

    it('should return false when NEXT_RUNTIME is undefined', () => {
      delete (global as any).window;
      global.process = { env: {} } as any;
      expect(isServer()).toBe(false);
    });
  });

  describe('isClient', () => {
    it('should return false when window is undefined', () => {
      expect(isClient()).toBe(false);
    });

    it('should return false when window.document is undefined', () => {
      expect(isClient()).toBe(false);
    });
  });
});
