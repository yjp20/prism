import { IForwarder } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import { IHttpConfig, IHttpRequest, IHttpResponse } from '../types';

export const forwarder: IForwarder<IHttpOperation, IHttpRequest, IHttpConfig, IHttpResponse> = {
  forward: async (
    {
      /* resource, input, config */
    }
  ) => {
    // forward request and return response
    throw new Error('Forwarder: Method not implemented.');
  },
};
