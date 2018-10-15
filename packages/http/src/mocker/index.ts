import { types } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import * as t from '../types';
import HttpOperationConfigNegotiator from '@stoplight/prism-http/mocker/negotiator/HttpOperationConfigNegotiator';
import { HttpProvider } from '@stoplight/prism-core/mock/http/HttpProvider';
import { JSONSchemaExampleGenerator } from '@stoplight/prism-core/mock/generator/JSONSchemaExampleGenerator';

const negotiator = new HttpOperationConfigNegotiator();
const mockProvider = new HttpProvider(new JSONSchemaExampleGenerator());

export const mocker: types.IMocker<
  IHttpOperation,
  t.IHttpRequest,
  t.IHttpConfig,
  t.IHttpResponse
> = {
  mock: async ({ resource, input, config }) => {
    //TODO: what if resource || input || config not defined?
    const mock: boolean | t.IHttpOperationConfig = config.mock;
    if(typeof mock === 'boolean') {
      // TODO: ??
      throw new Error();
    } else {
      const negotiationResult = await negotiator.negotiate({ resource, input, config: mock });
      const { error, httpOperationConfig } = negotiationResult;
      if(error) {
        // TODO: ??
        throw negotiationResult.error;
      } else if(!!httpOperationConfig) {
        const { data } = await mockProvider.mock(resource, httpOperationConfig);
        return data;
      } else {
        // TODO: ??
        throw new Error();
      }
    }
  },
};
