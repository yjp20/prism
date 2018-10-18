import { IMocker } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import { IHttpConfig, IHttpRequest, IHttpResponse } from '../types';

export const mocker: IMocker<IHttpOperation, IHttpRequest, IHttpConfig, IHttpResponse> = {
  mock: async (
    {
      /* resource, input, config */
    }
  ) => {
    // build response for resource, input, and config
    throw new Error('Method not implemented.');
  },
};
