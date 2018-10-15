import { IMockerOpts } from '@stoplight/prism-core/types';
import { IHttpOperationConfig, IHttpRequest } from '@stoplight/prism-http/types';
import { IHttpOperation } from '@stoplight/types/http';

import helpers from './NegotiatorHelpers';

export interface IHttpOperationConfigNegotiationResult {
  readonly httpOperationConfig?: IHttpOperationConfig;
  readonly error?: Error;
}

interface IOperationConfigNegotiator<Resource, Input, OperationConfig, Output> {
  negotiate(opts: IMockerOpts<Resource, Input, OperationConfig>): Promise<Output>;
}

export default class HttpOperationConfigNegotiator
  implements
    IOperationConfigNegotiator<
      IHttpOperation,
      IHttpRequest,
      IHttpOperationConfig,
      IHttpOperationConfigNegotiationResult
    > {
  public negotiate(
    opts: IMockerOpts<IHttpOperation, IHttpRequest, IHttpOperationConfig>
  ): Promise<IHttpOperationConfigNegotiationResult> {
    try {
      const { resource, input, config } = opts;
      const httpRequest = opts.input.data;
      const desiredConfig = Object.assign(
        {
          dynamic: this.getDynamic(httpRequest),
          code: this.getStatusCode(httpRequest),
          mediaType: this.getContentType(httpRequest),
          exampleKey: this.getExampleKey(httpRequest),
        },
        config
      );
      let httpOperationConfig: IHttpOperationConfig;

      if (input.validations.input.length > 0) {
        httpOperationConfig = helpers.negotiateOptionsForInvalidRequest(resource.responses);
      } else {
        httpOperationConfig = helpers.negotiateOptionsForValidRequest(resource, desiredConfig);
      }

      return Promise.resolve({
        httpOperationConfig,
      });
    } catch (error) {
      return Promise.resolve({
        error,
      });
    }
  }

  private getContentType(httpRequest: IHttpRequest): string | undefined {
    return (
      (httpRequest.query && httpRequest.query._contentType) ||
      (httpRequest.headers && httpRequest.headers['Content-Type'])
    );
  }

  private getExampleKey(httpRequest: IHttpRequest): string | undefined {
    return httpRequest.query && httpRequest.query._exampleKey;
  }

  private getStatusCode(httpRequest: IHttpRequest): string | undefined {
    return httpRequest.query && httpRequest.query._code;
  }

  private getDynamic(httpRequest: IHttpRequest): boolean | undefined {
    return httpRequest.query && httpRequest.query._dynamic === 'true';
  }
}
