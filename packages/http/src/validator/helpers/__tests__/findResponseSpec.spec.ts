import { findResponseSpec } from '../findResponseSpec';

describe('findResponseSpec()', () => {
  it('works', () => {
    expect(
      findResponseSpec(
        [
          { code: '2XX', contents: [] },
          { code: '20X', contents: [] },
          { code: '1XX', contents: [] },
        ],
        200
      )
    ).toEqual({ code: '20X', contents: [] });
  });
});
