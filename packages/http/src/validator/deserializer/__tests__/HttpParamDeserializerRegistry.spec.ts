import { IHttpParamStyleDeserializer } from '@stoplight/prism-http/validator/deserializer/IHttpParamStyleDeserializer';
import { DeserializeHttpQuery } from '@stoplight/prism-http/validator/deserializer/IHttpQueryParamStyleDeserializer';
import { HttpParamDeserializerRegistry } from '..//HttpParamDeserializerRegistry';

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
    });
  });

  describe('deserializer for given style does not exists', () => {
    it('returns undefined', () => {
      spyOn(mockDeserializer, 'supports').and.returnValue(false);
      expect(httpParamDeserializerRegistry.get('style')).toBeUndefined();
    });
  });
});
