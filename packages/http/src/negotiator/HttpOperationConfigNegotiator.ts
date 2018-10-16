import { IMockerOpts } from '@stoplight/prism-core/types';
import { IHttpOperationConfig, IHttpRequest } from '@stoplight/prism-http/types';
import { IHttpOperation } from '@stoplight/types/http';

import { IHttpNegotiationResult } from '@stoplight/prism-http/negotiator/types';
import helpers from './NegotiatorHelpers';

interface IOperationConfigNegotiator<Resource, Input, OperationConfig, Output> {
  negotiate(opts: IMockerOpts<Resource, Input, OperationConfig>): Promise<Output>;
}

export default class HttpOperationConfigNegotiator
  implements
    IOperationConfigNegotiator<
      IHttpOperation,
      IHttpRequest,
      IHttpOperationConfig,
      IHttpNegotiationResult
    > {
  public async negotiate(
    opts: IMockerOpts<IHttpOperation, IHttpRequest, IHttpOperationConfig>
  ): Promise<IHttpNegotiationResult> {
    const { resource, input, config } = opts;

    if (input.validations.input.length > 0) {
      return helpers.negotiateOptionsForInvalidRequest(resource.responses);
    } else {
      return helpers.negotiateOptionsForValidRequest(resource, config);
    }
  }
}
