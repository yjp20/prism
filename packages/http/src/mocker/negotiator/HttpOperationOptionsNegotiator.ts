import { IHttpRequest, IHttpOperationConfig } from "@stoplight/prism-http/types";
import { IHttpOperation } from "@stoplight/types/http";
import { IPrismInput } from "@stoplight/prism-core/types";
import helpers from '@stoplight/prism-http/mocker/negotiator/NegotiatorHelpers';

export interface IHttpOperationConfigNegotiationResult {
    readonly httpOperationConfig?: IHttpOperationConfig;
    readonly error?: Error;
}

interface IOperationConfigNegotiator<Resource, Input, OperationConfig, Output> {
    negotiate(resource: Resource, input: Input, desiredConfig: OperationConfig): Promise<Output>;
}

export default class HttpOperationOptionsNegotiator implements IOperationConfigNegotiator<
    IHttpOperation,
    IPrismInput<IHttpRequest>,
    IHttpOperationConfig,
    IHttpOperationConfigNegotiationResult> {

    public negotiate(resource: IHttpOperation, input: IPrismInput<IHttpRequest>, desiredConfig: IHttpOperationConfig): Promise<IHttpOperationConfigNegotiationResult> {
        try {
            const httpRequest = input.data;
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
