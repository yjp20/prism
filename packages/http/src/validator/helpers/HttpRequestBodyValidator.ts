import { IValidation } from '@stoplight/prism-core';
import { IValidatorRegistry } from '@stoplight/prism-http/validator/registry/IValidatorRegistry';
import { IHttpContent, IHttpRequest, IHttpRequestBody } from '@stoplight/types/http';

export class HttpRequestBodyValidator {
  constructor(private validatorRegistry: IValidatorRegistry) {}

  public validate(body: any, requestSpec?: IHttpRequest, mediaType?: string): IValidation[] {
    if (!requestSpec) {
      return [];
    }

    const content = this.getContent(requestSpec.body, mediaType);

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

  private getContent(
    requestBodySpec?: IHttpRequestBody,
    mediaType?: string
  ): IHttpContent | undefined {
    if (!requestBodySpec) {
      return;
    }

    const contentList = requestBodySpec.content;

    if (!mediaType) {
      return contentList[0];
    }

    const content = contentList.find(c => c.mediaType === mediaType);

    if (!content) {
      return contentList[0];
    }

    return content;
  }

}
