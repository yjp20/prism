import { getMediaTypeFromHeaders } from '../getMediaTypeFromHeaders';

describe('getMediaTypeFromHeaders()', () => {
  describe('Content-type header is present', () => {
    it('returns Content-type header value', () => {
      expect(getMediaTypeFromHeaders({ 'Content-type': 'application/json' })).toBe(
        'application/json'
      );
    });
  });

  describe('Content-type header is not present', () => {
    it('returns undefined', () => {
      expect(getMediaTypeFromHeaders({})).toBeUndefined();
    });
  });
});
