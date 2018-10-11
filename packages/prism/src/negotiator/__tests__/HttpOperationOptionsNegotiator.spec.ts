import HttpOperationOptionsNegotiator from '../HttpOperationOptionsNegotiator';
import HttpRequestValidator from '../../validator/HttpRequestValidator';
import { IHttpOperation, IHttpContent, IExample } from '@stoplight/types';
import { IHttpOperationOptions, IHttpRequest } from '../../types';
import IHttpRequestValidationResult from '../../validator/IHttpRequestValidationResult';

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
    const request: IHttpRequest = {
    };
    const operation: IHttpOperation = {
      method: '',
      path: '',
      responses: [],
      id: '',
    };
    const desiredOptions: IHttpOperationOptions = {
    };

    describe('when request is invalid', () => {
      beforeEach(() => {
        const validationResult: IHttpRequestValidationResult = {
          isValid: false
        };
        (<jest.Mock>HttpRequestValidatorMock.mock.instances[0].validate).mockReturnValue(validationResult);
      });

      describe('and 400 response exists', () => {
        let response;
        let httpContent: IHttpContent;
        let expectedMediaType = 'some';
        let expectedExampleKey = 'key'

        beforeEach(() => {
          httpContent = {
            mediaType: expectedMediaType,
            examples: []
          };
          response = {
            code: '400',
            content: []
          };
          operation.responses[0] = response;
        });

        describe('and has static example defined', () => {
          let example: IExample;

          beforeEach(() => {
            example = {
              key: expectedMediaType
            };
            httpContent.examples[0] = example;
            httpContent.examples[1] = { key: 'unexpected-key' };
          });

          it('should return the first static example', () => {
            return expectNoErrorAndOptions({
              code: '400',
              mediaType: expectedMediaType,
              exampleKey: expectedExampleKey,
              dynamic: false
            });
          });
        });

        describe('and has no static content', () => {
          beforeEach(() => {
            httpContent = {
              mediaType: expectedMediaType,
              examples: []
            };
            response.content[0] = httpContent;
          });

          it('should return the first schemable content', () => {
            httpContent.schema = {};

            return expectNoErrorAndOptions({
              code: '400',
              mediaType: expectedMediaType,
              dynamic: true,
              exampleKey: undefined
            });
          });
        });

      });
    });

    function expectNoErrorAndOptions(options) {
      return negotiator.negotiate(operation, desiredOptions, request)
        .then(negotiationResult => {
          expect(negotiationResult.error).toBeUndefined();
          expect(negotiationResult.httpOperationOptions).toEqual(options);
        })
    }

  });
});
