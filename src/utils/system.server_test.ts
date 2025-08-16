/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { isClient, isServer } from './system';

describe('system utilities', () => {
  const originalProcess = global.process;

  afterEach(() => {
    global.process = originalProcess;
  });

  describe('isServer', () => {
    it('should return true when window is undefined and NEXT_RUNTIME is nodejs', () => {
      global.process = { env: { NEXT_RUNTIME: 'nodejs' } } as any;
      expect(isServer()).toBe(true);
    });

    it('should return true when window is undefined and NEXT_RUNTIME is edge', () => {
      global.process = { env: { NEXT_RUNTIME: 'edge' } } as any;
      expect(isServer()).toBe(true);
    });

    it('should return false when NEXT_RUNTIME is not nodejs or edge', () => {
      global.process = { env: { NEXT_RUNTIME: 'other' } } as any;
      expect(isServer()).toBe(false);
    });

    it('should return false when NEXT_RUNTIME is undefined', () => {
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
