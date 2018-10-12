import { types } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import * as t from '../types';

export const validator: types.IValidator<
  IHttpOperation,
  t.IHttpRequest,
  t.IHttpConfig,
  t.IHttpResponse
> = {
  validateInput: async ({ resource, input, config }) => {
    throw new Error('Method not implemented.');
  },

  validateOutput: async ({ resource, output, config }) => {
    throw new Error('Method not implemented.');
  },
};
