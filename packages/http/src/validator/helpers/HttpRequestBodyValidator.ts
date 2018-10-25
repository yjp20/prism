import { IValidation } from '@stoplight/prism-core';
import { IHttpContent, IHttpRequest, IHttpRequestBody } from '@stoplight/types/http';
import { ValidatorRegistry } from '../registry/ValidatorRegistry';

export class HttpRequestBodyValidator {
  constructor(private validatorRegistry: ValidatorRegistry) {}

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

    if (!mediaType) {
      return [];
    }

    const validate = this.validatorRegistry.get(mediaType);

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
}
