import { IHttpParamDeserializerRegistry } from '@stoplight/prism-http/validator/deserializer/IHttpParamDeserializerRegistry';
import { DeserializeHttpHeader } from '../../deserializer/IHttpHeaderParamStyleDeserializer';
import { HttpHeadersValidator } from '../HttpHeadersValidator';

describe('HttpHeadersValidator', () => {
  const httpParamDeserializerRegistry = {
    deserializers: [],
    get: () => v => v,
  } as IHttpParamDeserializerRegistry<DeserializeHttpHeader>;
  const httpHeadersValidator = new HttpHeadersValidator(httpParamDeserializerRegistry);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(httpParamDeserializerRegistry, 'get');
  });

  describe('validate()', () => {
    describe('headers are missing', () => {
      it('returns empty validation error list', () => {
        expect(
          httpHeadersValidator.validate(undefined, { headers: [] }, 'application/json')
        ).toEqual([]);
      });
    });

    describe('spec for request is missing', () => {
      it('returns empty validation error list', () => {
        expect(httpHeadersValidator.validate({}, undefined, 'application/json')).toEqual([]);
      });
    });

    describe('spec for headers is missing', () => {
      it('returns empty validation error list', () => {
        expect(httpHeadersValidator.validate({}, {}, 'application/json')).toEqual([]);
      });
    });

    describe('spec is present', () => {
      describe('header is not present', () => {
        describe('spec defines it as required', () => {
          it('returns validation error', () => {
            expect(
              httpHeadersValidator.validate(
                {},
                { headers: [{ name: 'aHeader', required: true, content: {} }] }
              )
            ).toMatchSnapshot();
          });
        });
      });

      describe('header is present', () => {
        describe('schema is present', () => {
          describe('deserializer not available', () => {
            it('omits schema validation', () => {
              jest.spyOn(httpParamDeserializerRegistry, 'get').mockReturnValueOnce(undefined);

              expect(
                httpHeadersValidator.validate(
                  { 'x-test-header': 'abc' },
                  {
                    headers: [
                      {
                        name: 'x-test-header',
                        content: { '*': { mediaType: '*', schema: { type: 'number' } } },
                      },
                    ],
                  }
                )
              ).toEqual([]);
            });
          });

          describe('deserializer is available', () => {
            describe('header is valid', () => {
              it('validates positively against schema', () => {
                expect(
                  httpHeadersValidator.validate(
                    { 'x-test-header': 'abc' },
                    {
                      headers: [
                        {
                          name: 'x-test-header',
                          content: { '*': { mediaType: '*', schema: { type: 'string' } } },
                        },
                      ],
                    }
                  )
                ).toEqual([]);
              });
            });

            describe('header is not valid', () => {
              it('not validates against schema', () => {
                expect(
                  httpHeadersValidator.validate(
                    { 'x-test-header': 'abc' },
                    {
                      headers: [
                        {
                          name: 'x-test-header',
                          content: { '*': { mediaType: '*', schema: { type: 'number' } } },
                        },
                      ],
                    }
                  )
                ).toMatchSnapshot();
              });
            });
          });
        });

        describe('mediaType is provided', () => {
          describe('specific mediaType found in spec content list', () => {
            it('validates against more specific spec', () => {
              expect(
                httpHeadersValidator.validate(
                  { 'x-test-header': 'abc' },
                  {
                    headers: [
                      {
                        name: 'x-test-header',
                        content: {
                          '*': { mediaType: '*', schema: { type: 'string' } },
                          'application/testson': {
                            mediaType: 'application/testson',
                            schema: { type: 'number' },
                          },
                        },
                      },
                    ],
                  },
                  'application/testson'
                )
              ).toMatchSnapshot();
            });
          });

          describe('specific mediaType not found in spec content list', () => {
            it('validates against default spec', () => {
              expect(
                httpHeadersValidator.validate(
                  { 'x-test-header': 'abc' },
                  {
                    headers: [
                      {
                        name: 'x-test-header',
                        content: {
                          '*': { mediaType: '*', schema: { type: 'string' } },
                          'application/testson': {
                            mediaType: 'application/testson',
                            schema: { type: 'number' },
                          },
                        },
                      },
                    ],
                  },
                  'application/failson'
                )
              ).toMatchSnapshot();
            });
          });
        });

        describe('deprecated flag is set', () => {
          it('returns deprecation warning', () => {
            expect(
              httpHeadersValidator.validate(
                { 'x-test-header': 'abc' },
                {
                  headers: [
                    {
                      name: 'x-test-header',
                      deprecated: true,
                      content: {},
                    },
                  ],
                }
              )
            ).toMatchSnapshot();
          });
        });
      });
    });
  });
});
