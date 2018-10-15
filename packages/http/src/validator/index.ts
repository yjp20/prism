import { types } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import { IHttpConfig, IHttpRequest, IHttpResponse } from '../types';

export const validator: types.IValidator<
  IHttpOperation,
  IHttpRequest,
  IHttpConfig,
  IHttpResponse
> = {
  validateInput: async ({ resource, input, config }) => {
    throw new Error('Method not implemented.');
  },

  validateOutput: async ({ resource, output, config }) => {
    throw new Error('Method not implemented.');
  },
};
