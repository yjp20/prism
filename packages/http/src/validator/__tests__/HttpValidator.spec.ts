import { IHttpRequest } from '@stoplight/prism-http';
import { IHttpOperation } from '@stoplight/types';
import * as findResponseSpecModule from '../helpers/findResponseSpec';
import * as getMediaTypeFromHeadersModule from '../helpers/getMediaTypeFromHeaders';
import * as resolveRequestValidationConfigModule from '../helpers/resolveRequestValidationConfig';
import * as resolveResponseValidationConfigModule from '../helpers/resolveResponseValidationConfig';
import { HttpValidator } from '../HttpValidator';
import { IHttpBodyValidator } from '../structure/IHttpBodyValidator';
import { IHttpHeadersValidator } from '../structure/IHttpHeadersValidator';
import { IHttpQueryValidator } from '../structure/IHttpQueryValidator';

const mockError = {
  message: 'c is required',
  name: 'required',
  path: ['b'],
  severity: 'error',
  summary: 'c is required',
};

describe('HttpValidator', () => {
  const httpBodyValidator = { validate: () => [mockError] } as IHttpBodyValidator;
  const httpHeadersValidator = { validate: () => [mockError] } as IHttpHeadersValidator;
  const httpQueryValidator = { validate: () => [mockError] } as IHttpQueryValidator;
  const httpValidator = new HttpValidator(
    httpBodyValidator,
    httpHeadersValidator,
    httpQueryValidator
  );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(resolveRequestValidationConfigModule, 'resolveRequestValidationConfig');
    jest.spyOn(resolveResponseValidationConfigModule, 'resolveResponseValidationConfig');
    jest.spyOn(getMediaTypeFromHeadersModule, 'getMediaTypeFromHeaders').mockReturnValue(undefined);
    jest.spyOn(findResponseSpecModule, 'findResponseSpec').mockReturnValue({ content: [] });
    jest.spyOn(httpBodyValidator, 'validate');
    jest.spyOn(httpHeadersValidator, 'validate');
    jest.spyOn(httpQueryValidator, 'validate');
  });

  describe('validateInput()', () => {
    describe('body validation in enabled', () => {
      const test = (extendResource?: Partial<IHttpOperation>) => async () => {
        jest
          .spyOn(resolveRequestValidationConfigModule, 'resolveRequestValidationConfig')
          .mockReturnValueOnce({ body: true });

        await expect(
          httpValidator.validateInput({
            resource: Object.assign(
              { method: 'get', path: '/', responses: [], id: '1' },
              extendResource
            ),
            input: { method: 'get', url: { path: '/' } },
            config: { mock: true, validate: { request: { body: true } } },
          })
        ).resolves.toEqual([mockError]);

        expect(
          resolveRequestValidationConfigModule.resolveRequestValidationConfig
        ).toHaveBeenCalled();
        expect(getMediaTypeFromHeadersModule.getMediaTypeFromHeaders).toHaveBeenCalled();
        expect(httpBodyValidator.validate).toHaveBeenCalledWith(undefined, [], undefined);
        expect(httpHeadersValidator.validate).not.toHaveBeenCalled();
        expect(httpQueryValidator.validate).not.toHaveBeenCalled();
      };

      describe('request is not set', () => {
        it('validates body', test());
      });

      describe('request is set', () => {
        describe('request.body is not set', () => {
          it('validates body', test({ request: {} }));
        });

        describe('request.body is set', () => {
          it('validates body', test({ request: { body: { content: [] } } }));
        });
      });
    });

    describe('headers validation in enabled', () => {
      const test = (extendResource?: Partial<IHttpOperation>) => async () => {
        jest
          .spyOn(resolveRequestValidationConfigModule, 'resolveRequestValidationConfig')
          .mockReturnValueOnce({ headers: true });

        await expect(
          httpValidator.validateInput({
            resource: Object.assign(
              { method: 'get', path: '/', responses: [], id: '1' },
              extendResource
            ),
            input: { method: 'get', url: { path: '/' } },
            config: { mock: true, validate: { request: { headers: true } } },
          })
        ).resolves.toEqual([mockError]);

        expect(
          resolveRequestValidationConfigModule.resolveRequestValidationConfig
        ).toHaveBeenCalled();
        expect(getMediaTypeFromHeadersModule.getMediaTypeFromHeaders).toHaveBeenCalled();
        expect(httpBodyValidator.validate).not.toHaveBeenCalled();
        expect(httpHeadersValidator.validate).toHaveBeenCalledWith({}, [], undefined);
        expect(httpQueryValidator.validate).not.toHaveBeenCalled();
      };

      describe('request is not set', () => {
        it('validates headers', test());
      });

      describe('request is set', () => {
        describe('request.headers is not set', () => {
          it('validates headers', test({ request: {} }));
        });

        describe('request.headers is set', () => {
          it('validates headers', test({ request: { headers: [] } }));
        });
      });
    });

    describe('query validation in enabled', () => {
      const test = (
        extendResource?: Partial<IHttpOperation>,
        extendInput?: Partial<IHttpRequest>
      ) => async () => {
        jest
          .spyOn(resolveRequestValidationConfigModule, 'resolveRequestValidationConfig')
          .mockReturnValueOnce({ query: true });

        await expect(
          httpValidator.validateInput({
            resource: Object.assign(
              { method: 'get', path: '/', responses: [], id: '1' },
              extendResource
            ),
            input: Object.assign({ method: 'get', url: { path: '/', query: {} } }, extendInput),
            config: { mock: true, validate: { request: { query: true } } },
          })
        ).resolves.toEqual([mockError]);

        expect(
          resolveRequestValidationConfigModule.resolveRequestValidationConfig
        ).toHaveBeenCalled();
        expect(getMediaTypeFromHeadersModule.getMediaTypeFromHeaders).toHaveBeenCalled();
        expect(httpBodyValidator.validate).not.toHaveBeenCalled();
        expect(httpHeadersValidator.validate).not.toHaveBeenCalled();
        expect(httpQueryValidator.validate).toHaveBeenCalledWith({}, [], undefined);
      };

      describe('request is not set', () => {
        it('validates query', test());
      });

      describe('request is set', () => {
        describe('request.query is not set', () => {
          it('validates query', test({ request: {} }));
        });

        describe('request.query is set', () => {
          it('validates query', test({ request: { query: [] } }));
        });
      });

      describe('input.url.query is not set', () => {
        it("validates query assuming it's empty", test(undefined, { url: { path: '/' } }));
      });
    });
  });

  describe('validateOutput()', () => {
    describe('output is not set', () => {
      it('omits validation', async () => {
        await expect(
          httpValidator.validateOutput({
            resource: { method: 'get', path: '/', responses: [], id: '1' },
            config: { mock: true, validate: { response: { body: true } } },
          })
        ).resolves.toEqual([]);

        expect(httpBodyValidator.validate).not.toHaveBeenCalled();
      });
    });

    describe('output is set', () => {
      describe('body validation is enabled', () => {
        it('validates body', async () => {
          jest
            .spyOn(resolveResponseValidationConfigModule, 'resolveResponseValidationConfig')
            .mockReturnValueOnce({ body: true });

          await expect(
            httpValidator.validateOutput({
              resource: { method: 'get', path: '/', responses: [], id: '1' },
              output: { statusCode: 200 },
              config: { mock: true, validate: { response: { body: true } } },
            })
          ).resolves.toEqual([mockError]);

          expect(
            resolveResponseValidationConfigModule.resolveResponseValidationConfig
          ).toHaveBeenCalled();
          expect(getMediaTypeFromHeadersModule.getMediaTypeFromHeaders).toHaveBeenCalled();
          expect(findResponseSpecModule.findResponseSpec).toHaveBeenCalled();
          expect(httpBodyValidator.validate).toHaveBeenCalledWith(undefined, [], undefined);
          expect(httpHeadersValidator.validate).not.toHaveBeenCalled();
        });
      });

      describe('headers validation is enabled', () => {
        it('validates headers', async () => {
          jest
            .spyOn(resolveResponseValidationConfigModule, 'resolveResponseValidationConfig')
            .mockReturnValueOnce({ headers: true });

          await expect(
            httpValidator.validateOutput({
              resource: { method: 'get', path: '/', responses: [], id: '1' },
              output: { statusCode: 200 },
              config: { mock: true, validate: { response: { headers: true } } },
            })
          ).resolves.toEqual([mockError]);

          expect(
            resolveResponseValidationConfigModule.resolveResponseValidationConfig
          ).toHaveBeenCalled();
          expect(getMediaTypeFromHeadersModule.getMediaTypeFromHeaders).toHaveBeenCalled();
          expect(findResponseSpecModule.findResponseSpec).toHaveBeenCalled();
          expect(httpBodyValidator.validate).not.toHaveBeenCalled();
          expect(httpHeadersValidator.validate).toHaveBeenCalledWith({}, [], undefined);
        });
      });
    });
  });
});
