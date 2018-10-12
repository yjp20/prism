import { types } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import * as t from '../types';

export const mocker: types.IMocker<
  IHttpOperation,
  t.IHttpRequest,
  t.IHttpConfig,
  t.IHttpResponse
> = {
  mock: async ({ resource, input, config }) => {
    // build response for resource, input, and config
    throw new Error('Method not implemented.');
  },
};
