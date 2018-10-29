import { IValidator } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import { IHttpConfig, IHttpRequest, IHttpResponse } from '../types';

export const validator: IValidator<IHttpOperation, IHttpRequest, IHttpConfig, IHttpResponse> = {
  validateInput: async (
    {
      /*resource, input, config*/
    }
  ) => {
    throw new Error('Validator: Method not implemented.');
  },

  validateOutput: async (
    {
      /* resource, output, config */
    }
  ) => {
    throw new Error('Validator: Method not implemented.');
  },
};
