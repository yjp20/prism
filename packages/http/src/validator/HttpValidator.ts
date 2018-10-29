import { IValidation, IValidator } from '@stoplight/prism-core/types';
import { IHttpConfig, IHttpRequest, IHttpResponse } from '@stoplight/prism-http/types';
import { IHttpOperation, IHttpResponse as IHttpResponseSpec } from '@stoplight/types';
import { HttpBodyValidator } from './helpers/HttpBodyValidator';
import { HttpHeadersValidator } from './helpers/HttpHeadersValidator';
import { HttpQueryValidator } from './helpers/HttpQueryValidator';

export class HttpValidator
  implements IValidator<IHttpOperation, IHttpRequest, IHttpConfig, IHttpResponse> {
  constructor(
    private readonly bodyValidator: HttpBodyValidator,
    private readonly headersValidator: HttpHeadersValidator,
    private readonly queryValidator: HttpQueryValidator
  ) {}

  public async validateInput({
    resource,
    input,
    config: originalConfig,
  }: {
    resource: IHttpOperation;
    input: IHttpRequest;
    config?: IHttpConfig;
  }): Promise<IValidation[]> {
    const config = this.resolveRequestValidationConfig(originalConfig);
    const results: IValidation[] = [];
    const mediaType = this.getMediaType(input.headers || {});

    if (config.body) {
      Array.prototype.push.apply(
        results,
        this.bodyValidator.validate(input.body, resource.request!.body!.content || [], mediaType)
      );
    }

    if (config.headers) {
      Array.prototype.push.apply(
        results,
        this.headersValidator.validate(input.headers, resource.request!.headers || [], mediaType)
      );
    }

    if (config.query && input.url.query) {
      // intentionally joining query back together
      // it is going to be supplied as string in the future
      // https://stoplightio.atlassian.net/browse/SL-216
      const query = Object.keys(input.url.query)
        .map(key => `${key}=${input.url.query![key]}`)
        .join('&');

      Array.prototype.push.apply(
        results,
        this.queryValidator.validate(query, resource.request, mediaType)
      );
    }

    return results;
  }

  public async validateOutput({
    resource,
    output,
    config: originalConfig,
  }: {
    resource: IHttpOperation;
    output?: IHttpResponse;
    config?: IHttpConfig;
  }): Promise<IValidation[]> {
    if (!output) {
      return [];
    }

    const config = this.resolveResponseValidationConfig(originalConfig);
    const results: IValidation[] = [];
    const mediaType = this.getMediaType(output.headers || {});
    const responseSpec = this.findResponseSpec(resource.responses, output.statusCode);

    if (config.body) {
      Array.prototype.push.apply(
        results,
        this.bodyValidator.validate(output.body, responseSpec.content, mediaType)
      );
    }

    if (config.headers) {
      Array.prototype.push.apply(
        results,
        this.headersValidator.validate(output.headers, responseSpec.headers || [], mediaType)
      );
    }

    return results;
  }

  private findResponseSpec(responseSpecs: IHttpResponseSpec[], statusCode: number) {
    const sortedSpecs = responseSpecs
      .filter(spec => new RegExp(`^${spec.code.replace(/X/g, '\\d')}$`).test(String(statusCode)))
      .sort((s1, s2) => s1.code.split('X').length - s2.code.split('X').length);

    return sortedSpecs[0];
  }

  private resolveRequestValidationConfig(
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

  private resolveResponseValidationConfig(
    config?: IHttpConfig
  ): {
    headers: boolean;
    body: boolean;
  } {
    if (!config || !config.validate || !config.validate.response) {
      return {
        headers: true,
        body: true,
      };
    }

    const response = config.validate.response;

    if (typeof response === 'boolean') {
      return response
        ? {
            headers: true,
            body: true,
          }
        : {
            headers: false,
            body: false,
          };
    }

    return {
      headers: response.headers || true,
      body: response.body || true,
    };
  }

  private getMediaType(headers: { [key: string]: string }): string | undefined {
    const contentTypeKey = Object.keys(headers).find(name => name.toLowerCase() === 'content-type');
    return contentTypeKey && headers[contentTypeKey];
  }
}
