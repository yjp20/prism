import { IValidation } from '@stoplight/prism-core';
import { IValidatorRegistry } from '@stoplight/prism-http/validator/registry/IValidatorRegistry';
import { IHttpContent } from '@stoplight/types/http';

export class HttpBodyValidator {
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

    return validate(body, content.schema);
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
