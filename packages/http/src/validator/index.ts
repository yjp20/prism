import { IValidation, IValidator } from '@stoplight/prism-core';
import { IHttpContent, IHttpHeaderParam, IHttpOperation, IHttpQueryParam } from '@stoplight/types';

import {
  IHttpConfig,
  IHttpNameValue,
  IHttpNameValues,
  IHttpRequest,
  IHttpResponse,
} from '../types';
import {
  header as headerDeserializerRegistry,
  query as queryDeserializerRegistry,
} from './deserializers';
import { IHttpParamDeserializerRegistry } from './deserializers/types';
import { resolveRequestValidationConfig, resolveResponseValidationConfig } from './utils/config';
import { getHeaderByName } from './utils/http';
import { findResponseSpec } from './utils/spec';
import {
  HttpBodyValidator,
  HttpHeadersValidator,
  HttpQueryValidator,
  IHttpValidator,
  validatorRegistry,
} from './validators';
import { IValidatorRegistry } from './validators/types';

export class HttpValidator
  implements IValidator<IHttpOperation, IHttpRequest, IHttpConfig, IHttpResponse> {
  constructor(
    private readonly bodyValidator: IHttpValidator<any, IValidatorRegistry, IHttpContent>,
    private readonly headersValidator: IHttpValidator<
      IHttpNameValue,
      IHttpParamDeserializerRegistry<IHttpNameValue>,
      IHttpHeaderParam
    >,
    private readonly queryValidator: IHttpValidator<
      IHttpNameValues,
      IHttpParamDeserializerRegistry<IHttpNameValues>,
      IHttpQueryParam
    >
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
    const mediaType = getHeaderByName(input.headers || {}, 'content-type');

    if (config.body) {
      Array.prototype.push.apply(
        results,
        this.bodyValidator.validate(
          input.body,
          (resource.request && resource.request.body && resource.request.body.content) || [],
          validatorRegistry,
          'body',
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
          headerDeserializerRegistry,
          'header',
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
          queryDeserializerRegistry,
          'query',
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
    const mediaType = getHeaderByName(output.headers || {}, 'content-type');
    const responseSpec = findResponseSpec(resource.responses, output.statusCode);

    if (config.body) {
      Array.prototype.push.apply(
        results,
        this.bodyValidator.validate(
          output.body,
          (responseSpec && responseSpec.contents) || [],
          validatorRegistry,
          'body',
          mediaType
        )
      );
    }

    if (config.headers) {
      Array.prototype.push.apply(
        results,
        this.headersValidator.validate(
          output.headers || {},
          (responseSpec && responseSpec.headers) || [],
          headerDeserializerRegistry,
          'header',
          mediaType
        )
      );
    }

    return results;
  }
}

export const validator = new HttpValidator(
  new HttpBodyValidator(),
  new HttpHeadersValidator(),
  new HttpQueryValidator()
);
