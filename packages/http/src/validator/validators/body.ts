import { IValidation } from '@stoplight/prism-core';
import { IHttpContent } from '@stoplight/types/http';

import { IHttpValidator, IValidatorRegistry } from './types';

export class HttpBodyValidator implements IHttpValidator<any, IValidatorRegistry, IHttpContent> {
  public validate(
    target: any,
    specs: IHttpContent[],
    registry: IValidatorRegistry,
    mediaType?: string,
    prefix: string = 'body'
  ): IValidation[] {
    const content = this.getContent(specs, mediaType);

    if (!content) {
      return [];
    }

    if (!content.schema) {
      return [];
    }

    const validate = registry.get(content.mediaType);

    if (!validate) {
      return [];
    }

    return validate(target, content.schema).map(error =>
      Object.assign({}, error, { path: [prefix, ...error.path] })
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
