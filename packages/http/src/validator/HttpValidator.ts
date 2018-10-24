import { IValidation, IValidator, ValidationSeverity } from '@stoplight/prism-core/types';
import { IHttpConfig, IHttpRequest, IHttpResponse } from '@stoplight/prism-http/types';
import { IHttpContent, IHttpOperation } from '@stoplight/types';
import { ISchema } from '@stoplight/types/schema';
import * as Ajv from 'ajv';
import { ErrorObject } from 'ajv';
import { validateHeaders } from './helpers/validateHeaders';

export class HttpValidator
  implements IValidator<IHttpOperation, IHttpRequest, IHttpConfig, IHttpResponse> {
  private ajv: any;

  constructor() {
    this.ajv = new Ajv({ allErrors: true, messages: true });
  }
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

    if (config.body && resource.request && resource.request.body) {
      const content = this.getContent(resource, mediaType);

      if (content && content.schema) {
        Array.prototype.push.apply(results, this.validateRequestBody(input.body, content.schema));
      }
    }

    if (config.headers && resource.request && resource.request.headers) {
      Array.prototype.push.apply(
        results,
        validateHeaders(input.headers, resource.request.headers, mediaType)
      );
    }

    return results;
  }

  private convertAjvErrors(
    errors: ErrorObject[],
    pathPrefix: string,
    severity: ValidationSeverity
  ) {
    return errors.map(error => ({
      path: [pathPrefix, ...error.dataPath.split('.').slice(1)],
      name: error.keyword || '',
      summary: error.message || '',
      message: error.message || '',
      severity,
    }));
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

  private validateRequestBody(body: any, schema: ISchema): IValidation[] {
    // assuming JSON body and JSON schema
    const validate = this.ajv.compile(schema);
    const errors = validate(JSON.parse(body)) ? [] : validate.errors;
    return this.convertAjvErrors(errors, 'body', ValidationSeverity.ERROR);
  }

  private getContent(resource: IHttpOperation, mediaType?: string) {
    if (!resource.request) {
      return;
    }

    if (!resource.request.body) {
      return;
    }

    const contentList = resource.request.body.content;

    if (!mediaType) {
      return this.getDefaultContent(contentList);
    }

    const content = contentList.find(c => c.mediaType === mediaType);

    if (!content) {
      return this.getDefaultContent(contentList);
    }

    return content;
  }

  private getDefaultContent(contentList: IHttpContent[]) {
    const content = contentList.find(c => c.mediaType === 'application/json');
    if (!content) {
      return;
    }

    if (!contentList.length) {
      return;
    }

    return contentList[0];
  }

  private getMediaType(headers: { [key: string]: string }): string | undefined {
    const contentTypeKey = Object.keys(headers).find(name => name.toLowerCase() === 'content-type');
    return contentTypeKey && headers[contentTypeKey];
  }
}
