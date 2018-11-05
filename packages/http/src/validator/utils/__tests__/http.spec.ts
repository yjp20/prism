import { getHeaderByName, resolveContent } from '../http';

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

describe('resolveContent()', () => {
  describe('mediaType not provided', () => {
    it('returns default content', () => {
      expect(
        resolveContent({
          '*': { mediaType: '*' },
          'application/exists-son': { mediaType: 'application/exists-son' },
        })
      ).toMatchSnapshot();
    });
  });

  describe('mediaType provided', () => {
    describe('specific content exists', () => {
      it('returns specific content', () => {
        expect(
          resolveContent(
            {
              '*': { mediaType: '*' },
              'application/exists-son': { mediaType: 'application/exists-son' },
            },
            'application/exists-son'
          )
        ).toMatchSnapshot();
      });
    });

    describe('specific content does not exist', () => {
      it('returns default content', () => {
        expect(
          resolveContent(
            {
              '*': { mediaType: '*' },
              'application/exists-son': { mediaType: 'application/exists-son' },
            },
            'application/non-exists-son'
          )
        ).toMatchSnapshot();
      });
    });
  });
});
