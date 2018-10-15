import { IHttpRequest, IHttpOperationConfig } from "@stoplight/prism-http/types";
import { IHttpOperation } from "@stoplight/types/http";
import { IMockerOpts } from "@stoplight/prism-core/types";
import helpers from '@stoplight/prism-http/mocker/negotiator/NegotiatorHelpers';

export interface IHttpOperationConfigNegotiationResult {
    readonly httpOperationConfig?: IHttpOperationConfig;
    readonly error?: Error;
}

interface IOperationConfigNegotiator<Resource, Input, OperationConfig, Output> {
    negotiate(opts: IMockerOpts<Resource, Input, OperationConfig>): Promise<Output>;
}

export default class HttpOperationConfigNegotiator implements IOperationConfigNegotiator<
    IHttpOperation,
    IHttpRequest,
    IHttpOperationConfig,
    IHttpOperationConfigNegotiationResult> {

    public negotiate(opts: IMockerOpts<IHttpOperation, IHttpRequest, IHttpOperationConfig>): Promise<IHttpOperationConfigNegotiationResult> {
        try {
            const { resource, input, config: desiredConfig } = opts;
            const httpRequest = opts.input.data;
            let httpOperationConfig: IHttpOperationConfig;

            if (input.validations.input.length > 0) {
                httpOperationConfig = helpers.negotiateOptionsForInvalidRequest(resource.responses, httpRequest);
            } else {
                httpOperationConfig = helpers.negotiateOptionsForValidRequest(resource, desiredConfig, httpRequest);
            }

            return Promise.resolve({
                httpOperationConfig
            });
        } catch (error) {
            return Promise.resolve({
                error
            });
        }
    }
}
