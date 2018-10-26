import { ValidationSeverity } from '@stoplight/prism-core/types';
import { IValidatorRegistry } from '@stoplight/prism-http/validator/registry/IValidatorRegistry';
import { ISchema } from '@stoplight/types/schema';
import { HttpRequestBodyValidator } from '../HttpRequestBodyValidator';

describe('HttpRequestBodyValidator', () => {
  const validatorRegistry = { get: () => () => [] } as IValidatorRegistry;
  const httpRequestBodyValidator = new HttpRequestBodyValidator(validatorRegistry);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(validatorRegistry, 'get');
  });

  describe('validate()', () => {
    describe('request spec is not set', () => {
      it('returns no validation errors', () => {
        expect(httpRequestBodyValidator.validate('test', undefined, 'application/json')).toEqual(
          []
        );
      });
    });

    describe('body spec is not set', () => {
      it('returns no validation errors', () => {
        expect(httpRequestBodyValidator.validate('test', {}, 'application/json')).toEqual([]);
      });
    });

    describe('body spec is set', () => {
      describe('request media type is not provided', () => {
        it('returns no validation errors', () => {
          expect(
            httpRequestBodyValidator.validate('test', {
              body: {
                content: [{ mediaType: 'application/not-exists-son' }],
              },
            })
          ).toEqual([]);
        });
      });

      describe('request media type was not found in spec', () => {
        it('returns no validation errors', () => {
          expect(
            httpRequestBodyValidator.validate(
              'test',
              {
                body: {
                  content: [{ mediaType: 'application/not-exists-son' }],
                },
              },
              'application/json'
            )
          ).toEqual([]);
        });
      });

      describe('body schema is provided', () => {
        describe('validator for given media type does not exists', () => {
          it('return no validation errors', () => {
            jest.spyOn(validatorRegistry, 'get').mockImplementation(mediaType => {
              expect(mediaType).toBe('application/json');
              return;
            });

            expect(
              httpRequestBodyValidator.validate(
                'test',
                {
                  body: {
                    content: [{ mediaType: 'application/json', schema: {} }],
                  },
                },
                'application/json'
              )
            ).toEqual([]);

            expect(validatorRegistry.get).toHaveBeenCalledTimes(1);
          });
        });

        describe('validator for given media type exists', () => {
          it('return no validation errors', () => {
            const mockSchema = { type: 'string' };

            jest.spyOn(validatorRegistry, 'get').mockImplementation(mediaType => {
              expect(mediaType).toBe('application/json');
              return (content: any, schema: ISchema) => {
                expect(content).toEqual('test');
                expect(schema).toEqual(mockSchema);
                return [
                  {
                    path: ['a'],
                    name: 'testName',
                    summary: 'testSummary',
                    severity: ValidationSeverity.ERROR,
                    message: 'testMessage',
                  },
                ];
              };
            });

            expect(
              httpRequestBodyValidator.validate(
                'test',
                {
                  body: {
                    content: [{ mediaType: 'application/json', schema: mockSchema }],
                  },
                },
                'application/json'
              )
            ).toMatchSnapshot();

            expect(validatorRegistry.get).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    it('', () => {
      httpRequestBodyValidator.validate(
        'test',
        {
          body: {
            content: [
              {
                mediaType: 'application/json',
              },
            ],
          },
        },
        'application/json'
      );
    });
  });
});
