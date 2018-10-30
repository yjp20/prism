import { add, echo } from '../index';

describe('index', () => {
  test('add()', () => {
    expect(add(1, 2)).toBe(3);
  });

  test('add() given negative a', () => {
    expect(add(-1, 2)).toBe(-3);
  });

  test('echo', () => {
    expect(echo('some')).toBe('some');
  });
});
