import { createObjectFromKeyValList } from '../createObjectFromKeyValList';

describe('createObjectFromKeyValList()', () => {
  it('works', () => {
    expect(createObjectFromKeyValList(['a', 'b', 'c', 'd'])).toEqual({a: 'b', c: 'd'});
  });
});
