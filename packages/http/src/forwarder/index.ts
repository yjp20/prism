import { types } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import * as t from '../types';

export const forwarder: types.IForwarder<
  IHttpOperation,
  t.IHttpRequest,
  t.IHttpConfig,
  t.IHttpResponse
> = {
  forward: async ({ resource, input, config }) => {
    // forward request and return response
    throw new Error('Method not implemented.');
  },
};
