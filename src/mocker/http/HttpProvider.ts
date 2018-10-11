import { IHttpOperation } from '@stoplight/types';
import { IExampleGenerator } from '../generator/IExampleGenerator';
import { IMockProvider } from '../IMockProvider';
import { IMockResult } from '../IMockResult';
import { IHttpOperationOptions } from './IHttpOperationOptions';
import { IMockHttpResponse } from './IMockHttpResponse';

export class HttpProvider
  implements IMockProvider<IHttpOperation, IHttpOperationOptions, IMockResult<IMockHttpResponse>> {
  constructor(private exampleGenerator: IExampleGenerator<any>) {}

  public async mock(
    operation: IHttpOperation,
    options: IHttpOperationOptions
  ): Promise<IMockResult<IMockHttpResponse>> {
    const response = operation.responses.find(r => r.code === options.status);
    if (!response) {
      throw new Error(`Response for status code '${options.status}' not found`);
    }

    const content = response.content.find(c => c.mediaType === options.mediaType);
    if (!content) {
      throw new Error(`Content for media type '${options.mediaType}' not found`);
    }

    let body;
    if (options.dynamic) {
      if (!content.schema) {
        throw new Error('Cannot generate response, schema is missing');
      }

      body = await this.exampleGenerator.generate(content.schema, content.mediaType);
    } else {
      const example = content.examples && content.examples.find(e => e.key === options.example);

      if (!example) {
        throw new Error(`Example for key '${options.example}' not found`);
      }

      body = example.value;
    }

    return {
      data: {
        status: parseInt(response.code),
        // @todo: HttpHeaderParam[] ?
        headers: { 'Content-type': content.mediaType },
        body,
      },
    };
  }
}
