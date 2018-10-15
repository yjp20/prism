import { IHttpOperation } from '@stoplight/types';
import { IExampleGenerator } from '../generator/IExampleGenerator';
import { IMockProvider } from '../IMockProvider';
import { IMockResult } from '../IMockResult';
import { IHttpOperationConfig, IHttpResponse } from '@stoplight/prism-http/types';

export class HttpProvider
  implements IMockProvider<IHttpOperation, IHttpOperationConfig, IMockResult<IHttpResponse>> {
  constructor(private exampleGenerator: IExampleGenerator<any>) {}

  public async mock(
    resource: IHttpOperation,
    config: IHttpOperationConfig
  ): Promise<IMockResult<IHttpResponse>> {
    const response = resource.responses.find(r => r.code === config.code);
    if (!response) {
      throw new Error(`Response for status code '${config.code}' not found`);
    }

    const content = response.content.find(c => c.mediaType === config.mediaType);
    if (!content) {
      throw new Error(`Content for media type '${config.mediaType}' not found`);
    }

    let body;
    if (config.dynamic) {
      if (!content.schema) {
        throw new Error('Cannot generate response, schema is missing');
      }

      body = await this.exampleGenerator.generate(content.schema, content.mediaType);
    } else {
      const example = content.examples && content.examples.find(e => e.key === config.exampleKey);

      if (!example) {
        throw new Error(`Example for key '${config.exampleKey}' not found`);
      }

      body = example.value;
    }

    return {
      data: {
        statusCode: parseInt(response.code),
        // @todo: HttpHeaderParam[] ?
        headers: { 'Content-type': content.mediaType },
        body,
      },
    };
  }
}
