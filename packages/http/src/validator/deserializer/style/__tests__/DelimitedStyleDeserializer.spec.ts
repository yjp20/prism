import { DelimitedStyleDeserializer } from '../DelimitedStyleDeserializer';

describe('DelimitedStyleDeserializer', () => {
  const delimitedStyleDeserializer = new DelimitedStyleDeserializer('|', 'pipeDelimited');

  describe('supports()', () => {
    describe('style is supported', () => {
      it('returns true', () => {
        expect(delimitedStyleDeserializer.supports('pipeDelimited')).toBe(true);
      });
    });

    describe('style is not supported', () => {
      it('returns false', () => {
        expect(delimitedStyleDeserializer.supports('invalid')).toBe(false);
      });
    });
  });

  describe('deserialize()', () => {
    describe('schema type is not array', () => {
      it('throws exception', () => {
        expect(() =>
          delimitedStyleDeserializer.deserialize('key', {}, { type: 'string' }, false)
        ).toThrowErrorMatchingSnapshot();
      });
    });

    describe('schema type is array', () => {
      describe('explode is set', () => {
        describe('query param is an array', () => {
          it('returns unmodified query param', () => {
            expect(
              delimitedStyleDeserializer.deserialize('key', { key: ['a'] }, { type: 'array' }, true)
            ).toEqual(['a']);
          });
        });

        describe('query param is a string', () => {
          it('returns value converted to array', () => {
            expect(
              delimitedStyleDeserializer.deserialize('key', { key: 'a' }, { type: 'array' }, true)
            ).toEqual(['a']);
          });
        });
      });

      describe('explode is not set', () => {
        describe('query param is an array', () => {
          it('splits last query param array element', () => {
            expect(
              delimitedStyleDeserializer.deserialize(
                'key',
                { key: ['a|b|c', 'd|e|f'] },
                { type: 'array' },
                false
              )
            ).toEqual(['d', 'e', 'f']);
          });
        });

        describe('query param is a string', () => {
          it('splits query param value', () => {
            expect(
              delimitedStyleDeserializer.deserialize(
                'key',
                { key: 'a|b|c' },
                { type: 'array' },
                false
              )
            ).toEqual(['a', 'b', 'c']);
          });
        });
      });
    });
  });
});
