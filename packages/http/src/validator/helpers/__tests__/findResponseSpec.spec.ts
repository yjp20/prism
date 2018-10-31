import { findResponseSpec } from '../findResponseSpec';

describe('findResponseSpec()', () => {
  it('works', () => {
    expect(
      findResponseSpec(
        [{ code: '2XX', content: [] }, { code: '20X', content: [] }, { code: '1XX', content: [] }],
        200
      )
    ).toEqual({ code: '20X', content: [] });
  });
});
