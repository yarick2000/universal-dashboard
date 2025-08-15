/**
 * @jest-environment jsdom
 */

import { isClient } from './system';

describe('system utilities', () => {
  describe('isClient', () => {
    it('should return true when window and document are defined', () => {
      expect(isClient()).toBe(true);
    });
  });
});
