import { withTryCatch } from './exception';

describe('withTryCatch', () => {
  it('should return the result of the function if no error is thrown', () => {
    const fn = () => 42;
    expect(withTryCatch(fn)).toBe(42);
  });

  it('should return undefined if the function throws an error', () => {
    const fn = () => {
      throw new Error('Test error');
    };
    expect(withTryCatch(fn)).toBeUndefined();
  });

  it('should call errorHandler if the function throws an error', () => {
    const fn = () => {
      throw new Error('Test error');
    };
    const errorHandler = jest.fn();
    withTryCatch(fn, errorHandler);
    expect(errorHandler).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(errorHandler.mock.calls[0][0]).toBeInstanceOf(Error);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(errorHandler.mock.calls[0][0].message).toBe('Test error');
  });

  it('should not call errorHandler if no error is thrown', () => {
    const fn = () => 'success';
    const errorHandler = jest.fn();
    withTryCatch(fn, errorHandler);
    expect(errorHandler).not.toHaveBeenCalled();
  });

  it('should return undefined if a non-Error is thrown', () => {
    const fn = () => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw 'string error';
    };
    const errorHandler = jest.fn();
    expect(withTryCatch(fn, errorHandler)).toBeUndefined();
    expect(errorHandler).not.toHaveBeenCalled();
  });
});
