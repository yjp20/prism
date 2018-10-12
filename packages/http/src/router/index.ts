import { types } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import * as t from '../types';

export const router: types.IRouter<IHttpOperation, t.IHttpRequest, t.IHttpConfig> = {
  route: async ({ resources, input, config }) => {
    // given input and config, find and return the matching resource
    throw new Error('Method not implemented.');
  },
};
