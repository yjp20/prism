import { DeserializeHttpQuery, IHttpParamDeserializerRegistry } from '../../deserializer/types';
import * as resolveContentModule from '../../helpers/http';
import * as validateAgainstSchemaModule from '../../helpers/validate';
import { HttpQueryValidator } from '../HttpQueryValidator';

describe('HttpQueryValidator', () => {
  const httpParamDeserializerRegistry = {
    deserializers: [],
    get: () => v => v,
  } as IHttpParamDeserializerRegistry<DeserializeHttpQuery>;
  const httpQueryValidator = new HttpQueryValidator(httpParamDeserializerRegistry);

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
      describe('query param is not present', () => {
        describe('spec defines it as required', () => {
          it('returns validation error', () => {
            expect(
              httpQueryValidator.validate({}, [{ name: 'aParam', required: true, content: {} }])
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
                httpQueryValidator.validate({ param: 'abc' }, [
                  {
                    name: 'param',
                    content: { '*': { mediaType: '*', schema: { type: 'number' } } },
                  },
                ])
              ).toEqual([]);

              expect(validateAgainstSchemaModule.validateAgainstSchema).not.toHaveBeenCalled();
            });
          });

          describe('deserializer is available', () => {
            describe('query param is valid', () => {
              it('validates positively against schema', () => {
                expect(
                  httpQueryValidator.validate({ param: 'abc' }, [
                    {
                      name: 'param',
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
              httpQueryValidator.validate(
                { param: 'abc' },
                [
                  {
                    name: 'param',
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
              httpQueryValidator.validate({ param: 'abc' }, [
                {
                  name: 'param',
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
