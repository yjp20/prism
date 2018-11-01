import { IValidation } from '@stoplight/prism-core';
import { IHttpContent } from '@stoplight/types/http';
import { IValidatorRegistry } from '../registry/IValidatorRegistry';
import { IHttpBodyValidator } from './IHttpBodyValidator';

export class HttpBodyValidator implements IHttpBodyValidator {
  constructor(private validatorRegistry: IValidatorRegistry) {}

  public validate(body: any, contentSpecs: IHttpContent[], mediaType?: string): IValidation[] {
    const content = this.getContent(contentSpecs, mediaType);

    if (!content) {
      return [];
    }

    if (!content.schema) {
      return [];
    }

    const validate = this.validatorRegistry.get(content.mediaType);

    if (!validate) {
      return [];
    }

    return validate(body, content.schema)
      .map(error => Object.assign({}, error, { path: [ 'body', ...error.path ] }));
  }

  private getContent(contentSpecs: IHttpContent[], mediaType?: string): IHttpContent | undefined {
    if (!mediaType) {
      return contentSpecs[0];
    }

    const content = contentSpecs.find(c => c.mediaType === mediaType);

    if (!content) {
      return contentSpecs[0];
    }

    return content;
  }
}
