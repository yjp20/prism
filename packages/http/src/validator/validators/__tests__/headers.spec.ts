import { DeserializeHttpHeader, IHttpParamDeserializerRegistry } from '../../deserializers/types';
import * as resolveContentModule from '../../utils/http';
import { HttpHeadersValidator } from '../headers';
import * as validateAgainstSchemaModule from '../utils';

describe('HttpHeadersValidator', () => {
  const httpParamDeserializerRegistry = {
    deserializers: [],
    get: () => v => v,
  } as IHttpParamDeserializerRegistry<DeserializeHttpHeader>;
  const httpHeadersValidator = new HttpHeadersValidator(httpParamDeserializerRegistry);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(httpParamDeserializerRegistry, 'get');
    jest
      .spyOn(resolveContentModule, 'resolveContent')
      .mockImplementation(contentSpecs => contentSpecs[Object.keys(contentSpecs)[0]]);
    jest.spyOn(validateAgainstSchemaModule, 'validateAgainstSchema').mockImplementation(() => []);
  });

  describe('validate()', () => {
    describe('spec is present', () => {
      describe('header is not present', () => {
        describe('spec defines it as required', () => {
          it('returns validation error', () => {
            expect(
              httpHeadersValidator.validate(undefined, [
                { name: 'aHeader', required: true, content: {} },
              ])
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
                httpHeadersValidator.validate({ 'x-test-header': 'abc' }, [
                  {
                    name: 'x-test-header',
                    content: { '*': { mediaType: '*', schema: { type: 'number' } } },
                  },
                ])
              ).toEqual([]);

              expect(validateAgainstSchemaModule.validateAgainstSchema).not.toHaveBeenCalled();
            });
          });

          describe('deserializer is available', () => {
            describe('header is valid', () => {
              it('validates positively against schema', () => {
                expect(
                  httpHeadersValidator.validate({ 'x-test-header': 'abc' }, [
                    {
                      name: 'x-test-header',
                      content: { '*': { mediaType: '*', schema: { type: 'string' } } },
                    },
                  ])
                ).toEqual([]);

                expect(validateAgainstSchemaModule.validateAgainstSchema).toHaveBeenCalled();
              });
            });
          });
        });

        describe('content was not found', () => {
          it('omits schema validation', () => {
            jest.spyOn(resolveContentModule, 'resolveContent').mockReturnValueOnce(undefined);

            expect(
              httpHeadersValidator.validate(
                { 'x-test-header': 'abc' },
                [
                  {
                    name: 'x-test-header',
                    content: {
                      '*': { mediaType: '*', schema: { type: 'number' } },
                    },
                  },
                ],
                'application/testson'
              )
            ).toEqual([]);

            expect(httpParamDeserializerRegistry.get).not.toHaveBeenCalled();
            expect(validateAgainstSchemaModule.validateAgainstSchema).not.toHaveBeenCalled();
          });
        });

        describe('deprecated flag is set', () => {
          it('returns deprecation warning', () => {
            expect(
              httpHeadersValidator.validate({ 'x-test-header': 'abc' }, [
                {
                  name: 'x-test-header',
                  deprecated: true,
                  content: {},
                },
              ])
            ).toMatchSnapshot();
          });
        });
      });
    });
  });
});
