import { IMocker, IMockerOpts } from '@stoplight/prism-core/types';
import { IHttpOperation } from '@stoplight/types';
import HttpOperationConfigNegotiator from '../negotiator/HttpOperationConfigNegotiator';
import { IHttpConfig, IHttpOperationConfig, IHttpRequest, IHttpResponse } from '../types';
import { IExampleGenerator } from './generator/IExampleGenerator';

export class HttpMocker
  implements IMocker<IHttpOperation, IHttpRequest, IHttpConfig, IHttpResponse> {
  constructor(
    private _negotiator: HttpOperationConfigNegotiator,
    private _exampleGenerator: IExampleGenerator<any>
  ) {}

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
    config = config || { mock: true };

    const mockConfig: IHttpOperationConfig = typeof config.mock === 'boolean' ? {} : config.mock;

    // looking up proper example
    const negotiationResult = await this._negotiator.negotiate({
      resource,
      input,
      config: mockConfig,
    });

    if (!negotiationResult.example && !negotiationResult.schema) {
      throw new Error('Neither example nor schema is defined');
    }

    // preparing response body
    const body =
      negotiationResult.example ||
      (await this._exampleGenerator.generate(
        negotiationResult.schema,
        negotiationResult.mediaType
      ));

    return {
      statusCode: parseInt(negotiationResult.code),
      headers: {
        'Content-type': negotiationResult.mediaType,
      },
      body,
    };
  }
}
