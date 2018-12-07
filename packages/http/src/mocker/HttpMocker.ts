import { IMocker, IMockerOpts } from '@stoplight/prism-core';
import { IHttpOperation, INodeExample } from '@stoplight/types';

import { IHttpConfig, IHttpRequest, IHttpResponse } from '../types';
import { IExampleGenerator } from './generator/IExampleGenerator';
import helpers from './negotiator/NegotiatorHelpers';

export class HttpMocker
  implements IMocker<IHttpOperation, IHttpRequest, IHttpConfig, IHttpResponse> {
  constructor(private _exampleGenerator: IExampleGenerator<any>) {}

  public async mock({
    resource,
    input,
    config,
  }: Partial<IMockerOpts<IHttpOperation, IHttpRequest, IHttpConfig>>): Promise<IHttpResponse> {
    // pre-requirements check
    if (!resource) {
      throw new Error('Resource is not defined');
    }

    if (!input) {
      throw new Error('Http request is not defined');
    }

    // setting default values
    const inputMediaType = input.data.headers && input.data.headers['Content-type'];
    config = config || { mock: {} };
    const mockConfig: any = typeof config.mock === 'boolean' ? {} : Object.assign({}, config.mock);
    if (!mockConfig.mediaType && inputMediaType) {
      mockConfig.mediaType = inputMediaType;
    }

    // looking up proper example
    let negotiationResult;
    if (input.validations.input.length > 0) {
      negotiationResult = helpers.negotiateOptionsForInvalidRequest(resource.responses);
    } else {
      negotiationResult = helpers.negotiateOptionsForValidRequest(resource, mockConfig);
    }

    if (!negotiationResult.example && !negotiationResult.schema) {
      throw new Error('Neither example nor schema is defined');
    }

    // preparing response body
    let body;
    if (negotiationResult.example && (negotiationResult.example as INodeExample).value) {
      body = (negotiationResult.example as INodeExample).value;
    } else {
      body = await this._exampleGenerator.generate(
        negotiationResult.schema,
        negotiationResult.mediaType
      );
    }

    return {
      statusCode: parseInt(negotiationResult.code),
      headers: {
        'Content-type': negotiationResult.mediaType,
      },
      body,
    };
  }
}
