/**
 * @jest-environment jsdom
 */

import { isClient, isServer } from './system';

describe('system utilities', () => {
  describe('isClient', () => {
    it('should return true when window and document are defined', () => {
      expect(isClient()).toBe(true);
    });
  });

  describe('isServer', () => {
    it('should return false when window is defined', () => {
      expect(isServer()).toBe(false);
    });
  });
});
