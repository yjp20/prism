import { HttpParamDeserializerRegistry } from '..//HttpParamDeserializerRegistry';
import { DeserializeHttpQuery, IHttpParamStyleDeserializer } from '../types';

describe('HttpParamDeserializerRegistry', () => {
  const mockDeserializer = {
    deserialize: jest.fn(),
    supports: jest.fn(),
  } as IHttpParamStyleDeserializer<DeserializeHttpQuery>;
  const httpParamDeserializerRegistry = new HttpParamDeserializerRegistry([mockDeserializer]);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deserializer for given style exists', () => {
    it('returns validation closure', () => {
      spyOn(mockDeserializer, 'supports').and.returnValue(true);
      spyOn(mockDeserializer, 'deserialize');

      const deserialize = httpParamDeserializerRegistry.get('form');
      expect(deserialize).toEqual(expect.any(Function));

      if (!deserialize) {
        throw new Error('Expectation failed');
      }

      deserialize();

      expect(mockDeserializer.deserialize).toHaveBeenCalled();
    });
  });

  describe('deserializer for given style does not exists', () => {
    it('returns undefined', () => {
      spyOn(mockDeserializer, 'supports').and.returnValue(false);
      expect(httpParamDeserializerRegistry.get('style')).toBeUndefined();
    });
  });
});
