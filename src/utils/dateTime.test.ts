import { getDateTimeString } from './dateTime';

describe('getDateTimeString', () => {
  it('should return current date and time string in correct format when no timestamp is provided', () => {
    const result = getDateTimeString();
    // Match format: YYYY/MM/DD HH:mm:ss
    expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('should return correct date and time string for a given timestamp', () => {
    // 2023-05-15T13:45:30.000Z
    const timestamp = Date.UTC(2023, 4, 15, 13, 45, 30);
    const result = getDateTimeString(timestamp);
    const date = new Date(timestamp);
    const expected = `${date.getFullYear()}/` +
      `${String(date.getMonth() + 1).padStart(2, '0')}/` +
      `${String(date.getDate()).padStart(2, '0')} ` +
      `${String(date.getHours()).padStart(2, '0')}:` +
      `${String(date.getMinutes()).padStart(2, '0')}:` +
      `${String(date.getSeconds()).padStart(2, '0')}`;
    expect(result).toBe(expected);
  });

  it('should pad single digit month, day, hour, minute, and second with zero', () => {
    // 2023-01-02T03:04:05.000Z
    const timestamp = Date.UTC(2023, 0, 2, 3, 4, 5);
    const date = new Date(timestamp);
    const expected = `${date.getFullYear()}/` +
      `${String(date.getMonth() + 1).padStart(2, '0')}/` +
      `${String(date.getDate()).padStart(2, '0')} ` +
      `${String(date.getHours()).padStart(2, '0')}:` +
      `${String(date.getMinutes()).padStart(2, '0')}:` +
      `${String(date.getSeconds()).padStart(2, '0')}`;
    expect(getDateTimeString(timestamp)).toBe(expected);
  });
});
