import { resolveContent } from '../resolveContent';

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
