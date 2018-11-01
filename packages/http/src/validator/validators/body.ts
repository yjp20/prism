import { IValidation } from '@stoplight/prism-core';
import { IHttpContent } from '@stoplight/types/http';

import { IHttpValidator, IValidatorRegistry } from './types';

export class HttpBodyValidator implements IHttpValidator<any, IHttpContent> {
  constructor(private validatorRegistry: IValidatorRegistry) {}

  public validate(obj: any, specs: IHttpContent[], mediaType?: string): IValidation[] {
    const content = this.getContent(specs, mediaType);

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

    return validate(obj, content.schema).map(error =>
      Object.assign({}, error, { path: ['body', ...error.path] })
    );
  }

  private getContent(specs: IHttpContent[], mediaType?: string): IHttpContent | undefined {
    if (!mediaType) {
      return specs[0];
    }

    const content = specs.find(c => c.mediaType === mediaType);

    if (!content) {
      return specs[0];
    }

    return content;
  }
}
