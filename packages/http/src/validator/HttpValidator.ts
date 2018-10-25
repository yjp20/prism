import { IValidation, IValidator } from '@stoplight/prism-core/types';
import { IHttpConfig, IHttpRequest, IHttpResponse } from '@stoplight/prism-http/types';
import { HttpRequestBodyValidator } from '@stoplight/prism-http/validator/helpers/HttpRequestBodyValidator';
import { IHttpOperation } from '@stoplight/types';
import { validateHeaders } from './helpers/validateHeaders';

export class HttpValidator
  implements IValidator<IHttpOperation, IHttpRequest, IHttpConfig, IHttpResponse> {
  constructor(private requestBodyValidator: HttpRequestBodyValidator) {}

  public async validateInput({
    resource,
    input,
    config: originalConfig,
  }: {
    resource: IHttpOperation;
    input: IHttpRequest;
    config?: IHttpConfig;
  }): Promise<IValidation[]> {
    const config = this.resolveValidationConfig(originalConfig);
    const results: IValidation[] = [];
    const mediaType = this.getMediaType(input.headers || {});

    if (config.body) {
      Array.prototype.push.apply(
        results,
        this.requestBodyValidator.validate(input.body, resource.request, mediaType)
      );
    }

    if (config.headers) {
      Array.prototype.push.apply(
        results,
        validateHeaders(input.headers, resource.request, mediaType)
      );
    }

    return results;
  }

  private resolveValidationConfig(
    config?: IHttpConfig
  ): {
    hijack: boolean;
    headers: boolean;
    query: boolean;
    body: boolean;
  } {
    if (!config || !config.validate || !config.validate.request) {
      return {
        hijack: true,
        headers: true,
        query: true,
        body: true,
      };
    }

    const request = config.validate.request;

    if (typeof request === 'boolean') {
      return request
        ? {
            hijack: true,
            headers: true,
            query: true,
            body: true,
          }
        : {
            hijack: false,
            headers: false,
            query: false,
            body: false,
          };
    }

    return {
      hijack: request.hijack || true,
      headers: request.headers || true,
      query: request.query || true,
      body: request.body || true,
    };
  }

  private getMediaType(headers: { [key: string]: string }): string | undefined {
    const contentTypeKey = Object.keys(headers).find(name => name.toLowerCase() === 'content-type');
    return contentTypeKey && headers[contentTypeKey];
  }
}
