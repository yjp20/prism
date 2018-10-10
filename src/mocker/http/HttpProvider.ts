import { IHttpOperation } from '@stoplight/types';
import { IMockProvider } from '../IMockProvider';
import { IMockResult } from '../IMockResult';
import { IHttpOperationOptions } from './IHttpOperationOptions';
import { IMockHttpResponse } from './IMockHttpResponse';

export class HttpProvider
  implements IMockProvider<IHttpOperation, IHttpOperationOptions, IMockResult<IMockHttpResponse>> {
  public async mock(
    operation: IHttpOperation,
    options: IHttpOperationOptions
  ): Promise<IMockResult<IMockHttpResponse>> {
    const response = operation.responses.find(r => r.code === options.status);
    if (!response) {
      throw new Error(`Response for status code '${options.status}' not found`);
    }

    const content = response.content.find(c => c.mediaType === options.contentType);
    if (!content) {
      throw new Error(`Content for media type '${options.contentType}' not found`);
    }

    const example = content.examples && content.examples.find(e => e.key === options.example);
    if (!example) {
      throw new Error(`Example for key '${options.example}' not found`);
    }

    return {
      data: {
        status: parseInt(response.code),
        // @todo: HttpHeaderParam[] ?
        headers: { 'Content-type': content.mediaType },
        body: example.value,
      },
    };
  }
}
