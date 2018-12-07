import { findResponseSpec } from '../spec';

describe('findResponseSpec()', () => {
  it('works', () => {
    expect(
      findResponseSpec(
        [
          { code: '2XX', contents: [], headers: [] },
          { code: '20X', contents: [], headers: [] },
          { code: '1XX', contents: [], headers: [] },
        ],
        200
      )
    ).toEqual({ code: '20X', contents: [], headers: [] });
  });
});
