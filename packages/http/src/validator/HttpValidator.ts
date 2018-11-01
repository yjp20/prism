import { IValidation, IValidator } from '@stoplight/prism-core/types';
import { IHttpOperation } from '@stoplight/types';

import { IHttpConfig, IHttpRequest, IHttpResponse } from '../types';
import { findResponseSpec } from './helpers/findResponseSpec';
import { getMediaTypeFromHeaders } from './helpers/getMediaTypeFromHeaders';
import { resolveRequestValidationConfig } from './helpers/resolveRequestValidationConfig';
import { resolveResponseValidationConfig } from './helpers/resolveResponseValidationConfig';
import { IHttpBodyValidator } from './structure/IHttpBodyValidator';
import { IHttpHeadersValidator } from './structure/IHttpHeadersValidator';
import { IHttpQueryValidator } from './structure/IHttpQueryValidator';

export class HttpValidator
  implements IValidator<IHttpOperation, IHttpRequest, IHttpConfig, IHttpResponse> {
  constructor(
    private readonly bodyValidator: IHttpBodyValidator,
    private readonly headersValidator: IHttpHeadersValidator,
    private readonly queryValidator: IHttpQueryValidator
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
    const config = resolveRequestValidationConfig(originalConfig);
    const results: IValidation[] = [];
    const mediaType = getMediaTypeFromHeaders(input.headers || {});

    if (config.body) {
      Array.prototype.push.apply(
        results,
        this.bodyValidator.validate(
          input.body,
          (resource.request && resource.request.body && resource.request.body.content) || [],
          mediaType
        )
      );
    }

    if (config.headers) {
      Array.prototype.push.apply(
        results,
        this.headersValidator.validate(
          input.headers || {},
          (resource.request && resource.request.headers) || [],
          mediaType
        )
      );
    }

    if (config.query) {
      Array.prototype.push.apply(
        results,
        this.queryValidator.validate(
          input.url.query || {},
          (resource.request && resource.request.query) || [],
          mediaType
        )
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

    const config = resolveResponseValidationConfig(originalConfig);
    const results: IValidation[] = [];
    const mediaType = getMediaTypeFromHeaders(output.headers || {});
    const responseSpec = findResponseSpec(resource.responses, output.statusCode);

    if (config.body) {
      Array.prototype.push.apply(
        results,
        this.bodyValidator.validate(output.body, responseSpec.content, mediaType)
      );
    }

    if (config.headers) {
      Array.prototype.push.apply(
        results,
        this.headersValidator.validate(output.headers || {}, responseSpec.headers || [], mediaType)
      );
    }

    return results;
  }
}
