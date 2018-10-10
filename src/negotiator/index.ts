import { IHttpOperation, IHttpResponse } from '@stoplight/types';
import { IHttpOperationOptions, IHttpRequestValidator, IHttpRequest } from '../types';
import * as _ from 'lodash';
import { stat } from 'fs';

interface IOperationOptionsNegotiator<T, K, M> {
    negotiate(operationDefinition: T, request: K): Promise<M>;
}

class HttpOperationOptionsNegotiator implements IOperationOptionsNegotiator<IHttpOperation, IHttpRequest, IHttpOperationOptions> {

    constructor(private readonly httpRequestValidator: IHttpRequestValidator) {
    }

    public negotiate(httpOperation: IHttpOperation, httpRequest: IHttpRequest): Promise<IHttpOperationOptions> {
        let statusCode = '';
        let mediaType = '';
        let dynamic = false;
        let example = '';
        // negotiate for invalid request        
        if (!this.httpRequestValidator.isValid(httpOperation, httpRequest)) {
            return this.negotiateOptionsForInvalidRequest(httpOperation.responses, httpRequest);
        }

        // negotiate for valid request
        statusCode = httpRequest.query._code;

        if (statusCode) {
            // negotiate for forced status code
            const responseByForcedStatusCode = this.findResponseByStatusCode(httpOperation.responses, statusCode);
            if (!responseByForcedStatusCode) {
                // TODO: should we throw an exception?
                // https://stoplightio.atlassian.net/wiki/spaces/PN/pages/5996560/Prism+Feature+List+draft says
                // "Can be set by the user, if the status code doesn’t exist in the specification then try to use the default response.
                // If the status code doesn’t exist in the users specification send back a clear message to the user letting them know that."
                // which means that we want to return a response and an error message at the same time (?)

            }
        } else {
            // negotiate for default status code
            // we should try the lowest 200
            const lowest2xxResponse = this.findLowest2xx(httpOperation.responses);

            
        }
        return Promise.resolve({});
    }

    /**
     * Invalid requests follow a di
     * @param httpResponses 
     * @param httpRequest 
     */
    private negotiateOptionsForInvalidRequest(httpResponses: IHttpResponse[], httpRequest: IHttpRequest) {
        let statusCode = '400';
        // currently only try to find a 400 response, but we may want to support other cases in the future            
        const response = this.findResponseByStatusCode(httpResponses, statusCode);
        // TODO: what if no 400 response is defined?
        if (!response) {
            throw new Error('No 400 response defined');
        }
        // find first response with any static examples
        const responseWithExamples = response.content.find(content => !_.isEmpty(content.examples));
        // find first response with any static examples
        const responseWithSchema = response.content.find(content => !!content.schema);
        if (responseWithExamples) {
            mediaType = responseWithExamples.mediaType;
            // take first example
            example = responseWithExamples.examples![0].key;
            dynamic = false;
        } else if (responseWithSchema) {
            mediaType = responseWithSchema.mediaType;
            // take first example
            example = '';
            dynamic = true;
        }
        return Promise.resolve({
            statusCode,
            contentType: mediaType,
            example,
            dynamic,
        });
    }

    private negotiateRemainingOptions(statusCode: string) {
        mediaType = httpRequest.query._contentType || httpRequest.headers['Content-Type'] || 'application/json';
            let content = lowest2xxResponse.content.find(content => content.mediaType === mediaType);
            if (!content) {
                // default to first available response
                content = lowest2xxResponse.content[0];
            }

            // negotiate example key
            let exampleKey = httpRequest.query._example;
            if (!exampleKey && !_.isEmpty(content.examples)) {
                exampleKey = content.examples![0].key;
            }

            // negotiate isDynamic
            let dynamicParam = httpRequest.query._dynamic;
            if (dynamicParam === 'true') {
                // forced dynamic
                // TODO: what if schema does not exist?
            } else if (dynamicParam === 'false') {
                // forced static
                if (!exampleKey) {
                    // TODO: when if static does not exist?                    
                }
                dynamic = false;
            } else {
                // either dynamic or static, depends what is available
                if (exampleKey) {
                    dynamic = false;
                } else {
                    dynamic = true;
                    // TODO: but what if schema doesn't exist?
                }
            }
    }

    private findResponseByStatusCode(responses: IHttpResponse[], statusCode: string) {
        return responses.find(response => response.code === statusCode);
    }

    private negotiateByForcedCode(httpOperation: IHttpOperation, httpRequest: IHttpRequest): string | null {
        let { _code: statusCode } = httpRequest.query;
        if (statusCode) {
            this.findResponseByStatusCode(httpOperation.responses, httpRequest.query._code);
        }
        return null;
    }

    private findLowest2xx(httpResponses: IHttpResponse[]): IHttpResponse {
        const generic2xxResponse = this.findResponseByStatusCode(httpResponses, '2XX');
        const sorted2xxResponses = httpResponses
            .filter(response => response.code.match(/2\d\d/))
            .sort((a: IHttpResponse, b: IHttpResponse) => Number(a.code) - Number(b.code));
        if (_.isEmpty(sorted2xxResponses)) {
            if (generic2xxResponse) {
                return generic2xxResponse;
            }
            throw new Error('No 200 defined :(');
        } else {
            return sorted2xxResponses[0];
        }
    }
}