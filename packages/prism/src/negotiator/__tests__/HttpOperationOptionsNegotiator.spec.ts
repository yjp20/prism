import HttpOperationOptionsNegotiator from '../HttpOperationOptionsNegotiator';
import HttpRequestValidator from '../../validator/HttpRequestValidator';
import { IHttpOperation, IHttpContent, IExample } from '@stoplight/types';
import { IHttpOperationOptions, IHttpRequest } from '../../types';
import IHttpRequestValidationResult from '../../validator/IHttpRequestValidationResult';
import Chance from 'chance';
const chance = new Chance();

jest.mock('../../validator/HttpRequestValidator');
const HttpRequestValidatorMock = <jest.Mock<HttpRequestValidator>>HttpRequestValidator;

describe('HttpOperationOptionsNegotiator', () => {
  let negotiator: HttpOperationOptionsNegotiator;
  let validator: HttpRequestValidator;

  beforeEach(() => {
    HttpRequestValidatorMock.mockClear();
    validator = new HttpRequestValidatorMock();
    negotiator = new HttpOperationOptionsNegotiator(validator);
  });

  describe('negotiate()', () => {
    let desiredOptions: IHttpOperationOptions;
    let httpRequest: IHttpRequest;

    beforeEach(() => {
      desiredOptions = {};
      httpRequest = {};
    });

    describe('when httpRequest is invalid', () => {
      beforeEach(() => {
        givenInvalidRequest()
      });

      describe('and 400 response exists', () => {
        const actualCode = '400';
        const actualMediaType = chance.string();
        const actualExampleKey = chance.string();

        test('and has static examples defined should return the first static example', async () => {
          const httpOperation = anHttpOperation().withResponses([{
            code: actualCode,
            content: [{
              mediaType: actualMediaType,
              examples: [
                { key: actualExampleKey },
                { key: chance.string() }
              ]
            }]
          }]).instance();

          const actualNegotiationsResult = await negotiator.negotiate(httpOperation, desiredOptions, httpRequest)
          const expectedOptions = {
            code: actualCode,
            mediaType: actualMediaType,
            exampleKey: actualExampleKey,
            dynamic: false
          };

          expect(actualNegotiationsResult.error).toBeUndefined();
          expect(actualNegotiationsResult.httpOperationOptions).toEqual(expectedOptions);
        });

        describe('and has no static content', () => {
          test('and has schemable content should return first such content', async () => {
            const httpOperation = anHttpOperation().withResponses([{
              code: actualCode,
              content: [{
                mediaType: actualMediaType + chance.character(),
                examples: []
              }, {
                schema: {},
                mediaType: actualMediaType,
                examples: []
              }, {
                schema: {},
                mediaType: actualMediaType + chance.character(),
                examples: []
              }]
            }]).instance();

            const actualNegotiationsResult = await negotiator.negotiate(httpOperation, desiredOptions, httpRequest)
            const expectedOptions = {
              code: actualCode,
              mediaType: actualMediaType,
              exampleKey: undefined,
              dynamic: false
            };

            expect(actualNegotiationsResult.error).toBeUndefined();
            expect(actualNegotiationsResult.httpOperationOptions).toEqual(expectedOptions);
          });

          test('and no schemable content should return error', async () => {
            const httpOperation = anHttpOperation().withResponses([{
              code: actualCode,
              content: [{
                mediaType: actualMediaType,
                examples: []
              }, {
                mediaType: actualMediaType
              }]
            }]).instance();

            const actualNegotiationsResult = await negotiator.negotiate(httpOperation, desiredOptions, httpRequest)

            expect(actualNegotiationsResult.error).toEqual(new Error('Data corrupted'));
            expect(actualNegotiationsResult.httpOperationOptions).toBeUndefined();
          });
        });
      });

      describe('and no 400 response exists', () => {
        test('should return an error', async () => {
          const httpOperation = anHttpOperation().instance();

          const actualNegotiationsResult = await negotiator.negotiate(httpOperation, desiredOptions, httpRequest);

          expect(actualNegotiationsResult.error).toEqual(new Error('No 400 response defined'));
          expect(actualNegotiationsResult.httpOperationOptions).toBeUndefined();
        });
      });
    });

    describe('when httpRequest is valid', () => {
      beforeEach(givenValidRequest);
      // negotiateOptionsForValidRequest
      describe('and code provided', () => {
        // negotiateOptionsBySpecificCode
        describe('and response exists', () => {
          // negotiateOptionsBySpecificResponse
        });
        describe.done('and response not exist', () => {
          // negotiateOptionsForDefaultCodenegotiateOptionsForDefaultCode
          describe.done('and any 2XX exists', () => {
            // negotiateOptionsBySpecificResponse
            describe.done('and mediaType provided', () => {
              describe.done('and httpContent exists', () => {
                // negotiateByPartialOptionsAndHttpContent
                describe.done('and example key provided', () => {
                  describe.done('and example exists', () => {
                    test('should return that example', () => { });
                  });
                  describe.done('and example not exist', () => {
                    test('should return error', () => { });
                  });
                });
                describe.done('and example key not provided but dynamic forced', () => {
                  describe.done('and schema exists', () => {
                    test('should return dynamic', () => { });
                  });
                  describe.done('and schema not exist', () => {
                    test('should return error', () => { });
                  });
                });
                describe.done('and neither example key nor dynamic forced', () => {
                  describe.done('and any example exists', () => {
                    test('should return that example', () => { });
                  });
                  describe.done('and not example exist but dynamic exists', () => {
                    test('should return that dynamic', () => { });
                  });
                  describe.done('and neither example nor dynamic exist', () => {
                    test('should return error', () => { });
                  });
                });
              });
              describe.done('and httpContent not exist', () => {
                // negotiateDefaultMediaType
                describe.done('and default httpContent exists', () => {
                  // negotiateByPartialOptionsAndHttpContent
                  describe.done('and example key provided', () => {
                    describe.done('and example exists', () => {
                      test('should return that example', () => { });
                    });
                    describe.done('and example not exist', () => {
                      test('should return error', () => { });
                    });
                  });
                  describe.done('and example key not provided but dynamic forced', () => {
                    describe.done('and schema exists', () => {
                      test('should return dynamic', () => { });
                    });
                    describe.done('and schema not exist', () => {
                      test('should return error', () => { });
                    });
                  });
                  describe.done('and neither example key nor dynamic forced', () => {
                    describe.done('and any example exists', () => {
                      test('should return that example', () => { });
                    });
                    describe.done('and not example exist but dynamic exists', () => {
                      test('should return that dynamic', () => { });
                    });
                    describe.done('and neither example nor dynamic exist', () => {
                      test('should return error', () => { });
                    });
                  });
                });
                describe.done('and default httpContent not exist', () => {
                  test('should return error', () => { });
                });
              });
            });
            describe.done('and mediaType not provided', () => {
              // negotiateDefaultMediaType
              describe('and default httpContent exists', () => {
                // negotiateByPartialOptionsAndHttpContent
                describe('and example key provided', () => {
                  describe('and example exists', () => {
                    test('should return that example', () => { });
                  });
                  describe('and example not exist', () => {
                    test('should return error', () => { });
                  });
                });
                describe('and example key not provided but dynamic forced', () => {
                  describe('and schema exists', () => {
                    test('should return dynamic', () => { });
                  });
                  describe('and schema not exist', () => {
                    test('should return error', () => { });
                  });
                });
                describe('and neither example key nor dynamic forced', () => {
                  describe('and any example exists', () => {
                    test('should return that example', () => { });
                  });
                  describe('and not example exist but dynamic exists', () => {
                    test('should return that dynamic', () => { });
                  });
                  describe('and neither example nor dynamic exist', () => {
                    test('should return error', () => { });
                  });
                });
              });
              describe('and default httpContent not exist', () => {
                test('should return error', () => { });
              });
            });
          });
          describe.done('and none 2XX exists', () => {
            test('should return error', () => { });
          });
        });
      });

      describe.done('and code not provided', () => {
        // negotiateOptionsForDefaultCodenegotiateOptionsForDefaultCode
        describe.done('and any 2XX exists', () => {
          // negotiateOptionsBySpecificResponse
          describe.done('and mediaType provided', () => {
            describe.done('and httpContent exists', () => {
              // negotiateByPartialOptionsAndHttpContent
              describe.done('and example key provided', () => {
                describe.done('and example exists', () => {
                  test('should return that example', () => { });
                });
                describe.done('and example not exist', () => {
                  test('should return error', () => { });
                });
              });
              describe.done('and example key not provided but dynamic forced', () => {
                describe.done('and schema exists', () => {
                  test('should return dynamic', () => { });
                });
                describe.done('and schema not exist', () => {
                  test('should return error', () => { });
                });
              });
              describe.done('and neither example key nor dynamic forced', () => {
                describe.done('and any example exists', () => {
                  test('should return that example', () => { });
                });
                describe.done('and not example exist but dynamic exists', () => {
                  test('should return that dynamic', () => { });
                });
                describe.done('and neither example nor dynamic exist', () => {
                  test('should return error', () => { });
                });
              });
            });
            describe.done('and httpContent not exist', () => {
              // negotiateDefaultMediaType
              describe.done('and default httpContent exists', () => {
                // negotiateByPartialOptionsAndHttpContent
                describe.done('and example key provided', () => {
                  describe.done('and example exists', () => {
                    test('should return that example', () => { });
                  });
                  describe.done('and example not exist', () => {
                    test('should return error', () => { });
                  });
                });
                describe.done('and example key not provided but dynamic forced', () => {
                  describe.done('and schema exists', () => {
                    test('should return dynamic', () => { });
                  });
                  describe.done('and schema not exist', () => {
                    test('should return error', () => { });
                  });
                });
                describe.done('and neither example key nor dynamic forced', () => {
                  describe.done('and any example exists', () => {
                    test('should return that example', () => { });
                  });
                  describe.done('and not example exist but dynamic exists', () => {
                    test('should return that dynamic', () => { });
                  });
                  describe.done('and neither example nor dynamic exist', () => {
                    test('should return error', () => { });
                  });
                });
              });
              describe.done('and default httpContent not exist', () => {
                test('should return error', () => { });
              });
            });
          });
          describe.done('and mediaType not provided', () => {
            // negotiateDefaultMediaType
            describe('and default httpContent exists', () => {
              // negotiateByPartialOptionsAndHttpContent
              describe('and example key provided', () => {
                describe('and example exists', () => {
                  test('should return that example', () => { });
                });
                describe('and example not exist', () => {
                  test('should return error', () => { });
                });
              });
              describe('and example key not provided but dynamic forced', () => {
                describe('and schema exists', () => {
                  test('should return dynamic', () => { });
                });
                describe('and schema not exist', () => {
                  test('should return error', () => { });
                });
              });
              describe('and neither example key nor dynamic forced', () => {
                describe('and any example exists', () => {
                  test('should return that example', () => { });
                });
                describe('and not example exist but dynamic exists', () => {
                  test('should return that dynamic', () => { });
                });
                describe('and neither example nor dynamic exist', () => {
                  test('should return error', () => { });
                });
              });
            });
            describe('and default httpContent not exist', () => {
              test('should return error', () => { });
            });
          });
        });
        describe.done('and none 2XX exists', () => {
          test('should return error', () => { });
        });
      })
    });
  });

  function givenInvalidRequest() {
    const validationResult: IHttpRequestValidationResult = {
      isValid: false
    };
    (<jest.Mock>HttpRequestValidatorMock.mock.instances[0].validate).mockReturnValue(validationResult);
  }

  function givenValidRequest() {
    const validationResult: IHttpRequestValidationResult = {
      isValid: true
    };
    (<jest.Mock>HttpRequestValidatorMock.mock.instances[0].validate).mockReturnValue(validationResult);
  }

  function anHttpOperation() {
    const httpOperation = {
      method: chance.string(),
      path: chance.url(),
      responses: [],
      id: chance.string(),
    };
    return {
      instance() {
        return httpOperation;
      },
      withResponses(responses) {
        httpOperation.responses = responses;
        return this;
      }
    }
  }

});
