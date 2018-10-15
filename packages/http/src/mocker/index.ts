import { types } from '@stoplight/prism-core';
import { IMockProvider, IMockResult } from '@stoplight/prism-core/mocker/types';
import { IHttpOperation } from '@stoplight/types';

import HttpOperationConfigNegotiator from '../negotiator/HttpOperationConfigNegotiator';
import { IHttpConfig, IHttpOperationConfig, IHttpRequest, IHttpResponse } from '../types';
import { IExampleGenerator } from './generator/IExampleGenerator';
import { JSONSchemaExampleGenerator } from './generator/JSONSchemaExampleGenerator';

const negotiator = new HttpOperationConfigNegotiator();

class HttpProvider
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
const mockProvider = new HttpProvider(new JSONSchemaExampleGenerator());

export const mocker: types.IMocker<IHttpOperation, IHttpRequest, IHttpConfig, IHttpResponse> = {
  mock: async ({ resource, input, config }) => {
    // TODO: what if resource || input || config not defined?
    // ANS: We should pick some sensible defaults.
    const mock: boolean | IHttpOperationConfig = config.mock;
    if (typeof mock === 'boolean') {
      // TODO: ??
      throw new Error();
    } else {
      const negotiationResult = await negotiator.negotiate({ resource, input, config: mock });
      const { error, httpOperationConfig } = negotiationResult;
      if (error) {
        // TODO: ??
        throw negotiationResult.error;
        // What does the !! mean?
      } else if (!!httpOperationConfig) {
        const { data } = await mockProvider.mock(resource, httpOperationConfig);
        return data;
      } else {
        // TODO: ??
        throw new Error();
      }
    }
  },
};
