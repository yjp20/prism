import { getHeaderByName } from '../http';

describe('getHeaderByName()', () => {
  describe('Content-type header is present', () => {
    it('returns Content-type header value', () => {
      expect(getHeaderByName({ 'Content-type': 'application/json' }, 'content-type')).toBe(
        'application/json'
      );
    });
  });

  describe('Content-type header is not present', () => {
    it('returns undefined', () => {
      expect(getHeaderByName({}, 'content-type')).toBeUndefined();
    });
  });
});
