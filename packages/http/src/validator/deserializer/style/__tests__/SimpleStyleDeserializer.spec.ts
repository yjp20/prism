import * as createObjectFromKeyValListModule from '../../../helpers/object';
import { SimpleStyleDeserializer } from '../SimpleStyleDeserializer';

describe('SimpleStyleDeserializer', () => {
  const simpleStyleDeserializer = new SimpleStyleDeserializer();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('supports()', () => {
    describe('style is supported', () => {
      it('returns true', () => {
        expect(simpleStyleDeserializer.supports('simple')).toBe(true);
      });
    });

    describe('style is not supported', () => {
      it('returns false', () => {
        expect(simpleStyleDeserializer.supports('invalid')).toBe(false);
      });
    });
  });

  describe('deserialize()', () => {
    describe('type is a primitive', () => {
      it('returns unmodified value', () => {
        expect(simpleStyleDeserializer.deserialize('value', 'string', false)).toEqual('value');
      });
    });

    describe('type is an array', () => {
      describe('value is empty', () => {
        it('returns empty array', () => {
          expect(simpleStyleDeserializer.deserialize('', 'array', false)).toEqual([]);
        });
      });

      describe('value is comma separated', () => {
        it('returns exploded array', () => {
          expect(simpleStyleDeserializer.deserialize('a,b,c', 'array', false)).toEqual([
            'a',
            'b',
            'c',
          ]);
        });
      });
      it('returns unmodified value', () => {
        expect(simpleStyleDeserializer.deserialize('value', 'string', false)).toEqual('value');
      });
    });

    describe('type is an object', () => {
      describe('explode is not set', () => {
        it('splits by comma and returns object', () => {
          jest
            .spyOn(createObjectFromKeyValListModule, 'createObjectFromKeyValList')
            .mockImplementationOnce(list => {
              expect(list).toEqual(['a', 'b', 'c', 'd']);
              return { a: 'b', c: 'd' };
            });
          expect(simpleStyleDeserializer.deserialize('a,b,c,d', 'object', false)).toEqual({
            a: 'b',
            c: 'd',
          });
          expect(createObjectFromKeyValListModule.createObjectFromKeyValList).toHaveBeenCalled();
        });
      });

      describe('explode is set', () => {
        it('splits by comma and equality sign and returns object', () => {
          expect(simpleStyleDeserializer.deserialize('a=b,c=d', 'object', true)).toEqual({
            a: 'b',
            c: 'd',
          });
        });
      });
    });
  });
});
