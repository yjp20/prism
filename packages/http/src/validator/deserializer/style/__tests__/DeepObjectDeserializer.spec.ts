import { DeepObjectStyleDeserializer } from '../DeepObjectStyleDeserializer';

describe('DeepObjectStyleDeserializer', () => {
  const deepObjectStyleDeserializer = new DeepObjectStyleDeserializer();

  describe('supports()', () => {
    describe('style is supported', () => {
      it('returns true', () => {
        expect(deepObjectStyleDeserializer.supports('deepObject')).toBe(true);
      });
    });

    describe('style is not supported', () => {
      it('returns false', () => {
        expect(deepObjectStyleDeserializer.supports('invalid')).toBe(false);
      });
    });
  });

  describe('deserialize()', () => {
    describe('schema type is not an object', () => {
      it('throws exception', () => {
        expect(() =>
          deepObjectStyleDeserializer.deserialize('key', {}, { type: 'string' })
        ).toThrowErrorMatchingSnapshot();
      });
    });

    describe('schema type is an object', () => {
      it('converts params to object properly', () => {
        expect(
          deepObjectStyleDeserializer.deserialize(
            'key',
            { 'key[a]': 'str', 'key[b][ba]': 'str', other: 'other' },
            {
              type: 'object',
              properties: {
                a: { type: 'string' },
                b: {
                  type: 'object',
                  properties: { ba: { type: 'string' }, bb: { type: 'object' } },
                },
              },
            }
          )
        ).toEqual({ a: 'str', b: { ba: 'str', bb: {} } });
      });

      describe('no properties are defined', () => {
        it('return empty object', () => {
          expect(deepObjectStyleDeserializer.deserialize('key', {}, { type: 'object' })).toEqual(
            {}
          );
        });
      });
    });
  });
});
