import { IRouter } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import { IHttpConfig, IHttpRequest } from '../types';

export const router: IRouter<IHttpOperation, IHttpRequest, IHttpConfig> = {
  route: async (
    {
      /* resource, input, config */
    }
  ) => {
    // given input and config, find and return the matching resource
    throw new Error('Method not implemented.');
  },
};
