import { IHttpOperation, IHttpResponse, IHttpContent, IExample } from '@stoplight/types';
import { IHttpOperationOptions, IHttpRequestValidator, IHttpRequest, IHttpOperationOptionsNegotiationResult, IHttpRequestValidationResult } from '../types';
import * as _ from 'lodash';
import { stat } from 'fs';

interface IOperationOptionsNegotiator<T, K, M> {
    negotiate(operationDefinition: T, request: K): Promise<M>;
}

class HttpOperationOptionsNegotiator implements IOperationOptionsNegotiator<IHttpOperation, IHttpRequest, IHttpOperationOptionsNegotiationResult> {

    constructor(private readonly httpRequestValidator: IHttpRequestValidator) {
    }

    public negotiate(httpOperation: IHttpOperation, httpRequest: IHttpRequest): Promise<IHttpOperationOptionsNegotiationResult> {
        try {
            let httpOperationOptions: IHttpOperationOptions;
            let negotiationResult: IHttpOperationOptionsNegotiationResult;
            let validationResult: IHttpRequestValidationResult = this.httpRequestValidator.validate(httpOperation, httpRequest);

            if (!validationResult.isValid) {
                httpOperationOptions = this.negotiateOptionsForInvalidRequest(httpOperation.responses, httpRequest);
            } else {
                httpOperationOptions = this.negotiateOptionsForValidRequest(httpOperation, httpRequest);
            }

            return Promise.resolve({
                httpOperationOptions
            });
        } catch (error) {
            return Promise.resolve({
                error
            });
        }
    }

    /**
     * Invalid requests follows a different logic than a regular, valid request.
     * In particular, if the request is invalid, we do not take the forced parameters, such as: _dynamic or _code, into account.
     * This function will simply try to negotiate options for a 400 code. It will do its best to produce any result
     * based on available mediaTypes and examples/schemas.
     * 
     * The logic is the following:
     * - find a 400 response
     *      @if exists: 
     *          - find first static example (regardless of the mediaType)
     *              @if exists: return
     *              @if !exist:
     *                  - find first response with a schema (regardless of the mediaType)
     *                      @if exists:
     *                          - return
     *                      @else
     *                          - throw error
     *      @else: throw error        
     */
    private negotiateOptionsForInvalidRequest(httpResponses: IHttpResponse[], httpRequest: IHttpRequest): IHttpOperationOptions {
        // currently only try to find a 400 response, but we may want to support other cases in the future
        let code = '400';
        let mediaType;
        let exampleKey;
        let dynamic;

        const response = this.findResponseByStatusCode(httpResponses, code);
        // TODO: what if no 400 response is defined?
        if (!response) {
            throw new Error('No 400 response defined');
        }
        // find first response with any static examples
        const responseWithExamples = response.content.find(content => !_.isEmpty(content.examples));
        // find first response with a schema
        const responseWithSchema = response.content.find(content => !!content.schema);

        if (responseWithExamples) {
            mediaType = responseWithExamples.mediaType;
            exampleKey = responseWithExamples.examples![0].key;
            dynamic = false;
        } else if (responseWithSchema) {
            mediaType = responseWithSchema.mediaType;
            dynamic = true;
        } else {
            throw new Error('Data corrupted');
        }
        return {
            code,
            mediaType,
            exampleKey,
            dynamic,
        };
    }

    private negotiateOptionsForValidRequest(httpOperation: IHttpOperation, httpRequest: IHttpRequest): IHttpOperationOptions {
        let code: string = this.getForcedCode(httpRequest);
        if (code) {
            return this.negotiateOptionsBySpecificCode(httpOperation, httpRequest, code);
        }
        return this.negotiateOptionsForDefaultCode(httpOperation, httpRequest);
    }

    private negotiateOptionsForDefaultCode(httpOperation: IHttpOperation, httpRequest: IHttpRequest): IHttpOperationOptions {
        const lowest2xxResponse = this.findLowest2xx(httpOperation.responses);
        if (lowest2xxResponse) {
            return this.negotiateOptionsBySpecificResponse(httpOperation, httpRequest, lowest2xxResponse);
        }
        throw new Error('No 2** response defined, cannot mock');
    }

    private negotiateOptionsBySpecificResponse(httpOperation: IHttpOperation, httpRequest: IHttpRequest, response: IHttpResponse): IHttpOperationOptions {
        const { code } = response;
        let { _example: exampleKey } = httpRequest.query;
        let dynamic = this.getForcedDynamic(httpRequest);
        let mediaType = this.getMediaType(httpRequest);

        if (mediaType) {
            // a user provided mediaType
            let httpContent = this.findHttpContentByMediaType(response, mediaType);
            if (httpContent) {
                // a httpContent for a provided mediaType exists
                return this.negotiateByPartialOptionsAndHttpContent({
                    mediaType,
                    code,
                    dynamic,
                    exampleKey
                }, httpContent);
            }
        }
        // user did not provide mediaType
        // OR
        // a httpContent for a provided mediaType does not exist
        return this.negotiateDefaultMediaType({
            code,
            dynamic,
            exampleKey
        }, response);
    }

    private negotiateDefaultMediaType(partialOptions: IHttpOperationOptions, response: IHttpResponse) {
        const { code, dynamic, exampleKey } = partialOptions;
        const mediaType = 'application/json';
        let httpContent = this.findHttpContentByMediaType(response, mediaType);
        if (httpContent) {
            // a httpContent for default mediaType exists
            return this.negotiateByPartialOptionsAndHttpContent({
                mediaType,
                code,
                dynamic,
                exampleKey
            }, httpContent);
        }
        // a httpContent for default mediaType does not exist
        throw new Error(`Could not generate response for provided content type or no content type provided.
                            Tried to fallback to application/json, but no definition found.`);
    }

    private negotiateByPartialOptionsAndHttpContent(partialOptions: IHttpOperationOptions, httpContent: IHttpContent) {
        const { code, mediaType, exampleKey, dynamic } = partialOptions;

        if (exampleKey) {
            // the user provided exampleKey - highest priority
            const example = this.findExampleByKey(httpContent, exampleKey);
            if (example) {
                // example exists, return
                return {
                    code,
                    mediaType,
                    exampleKey
                }
            } else {
                throw new Error(`Response for contentType: ${mediaType} and exampleKey: ${exampleKey} does not exist.`);
            }
        } else if (dynamic === true) {
            if (httpContent.schema) {
                return {
                    code,
                    mediaType,
                    dynamic
                }
            } else {
                throw new Error(`Tried to force a dynamic response for: ${mediaType} but schema is not defined.`);
            }
        } else {
            // try to find a static example first
            const example = this.findBestExample(httpContent);
            if (example) {
                // if example exists, return
                return {
                    code,
                    mediaType,
                    exampleKey: example.key
                }
            } else if (httpContent.schema) {
                return {
                    code,
                    mediaType,
                    dynamic: true
                }
            } else {
                throw new Error(`Not possible to generate a response for contentType: ${mediaType}`);
            }
        }
    }

    private findBestExample(httpContent: IHttpContent) {
        return httpContent.examples && httpContent.examples[0];
    }

    private findExampleByKey(httpContent: IHttpContent, exampleKey: string) {
        return httpContent.examples && httpContent.examples.find(example => example.key === exampleKey);
    }

    private negotiateOptionsBySpecificCode(httpOperation: IHttpOperation, httpRequest: IHttpRequest, code: string): IHttpOperationOptions {
        let mediaType;
        let exampleKey;
        let dynamic;
        // find response by provided status code
        const responseByForcedStatusCode = this.findResponseByStatusCode(httpOperation.responses, code);
        if (responseByForcedStatusCode) {
            try {
                // try to negotiate
                return this.negotiateOptionsBySpecificResponse(httpOperation, httpRequest, responseByForcedStatusCode);
            } catch (error) {
                // if negotiations fail try a default code
                return this.negotiateOptionsForDefaultCode(httpOperation, httpRequest);
            }
        }
        // if no response found under a status code, try to mock a default code
        return this.negotiateOptionsForDefaultCode(httpOperation, httpRequest);
    }

    private getForcedDynamic(httpRequest: IHttpRequest): boolean | undefined {
        const dynamicParam: string = httpRequest.query._dynamic;
        return dynamicParam === 'true' ? true : (dynamicParam === 'false' ? false : undefined);
    }

    private getForcedCode(httpRequest: IHttpRequest): string {
        return httpRequest.query._code;
    }

    private getMediaType(httpRequest: IHttpRequest): string {
        return httpRequest.query._contentType || httpRequest.headers['Content-Type'];
    }

    private findResponseByStatusCode(responses: IHttpResponse[], statusCode: string): IHttpResponse | undefined {
        return responses.find(response => response.code === statusCode);
    }

    private findHttpContentByMediaType(response: IHttpResponse, mediaType: string): IHttpContent | undefined {
        return response.content.find(content => content.mediaType === mediaType);
    }

    private findLowest2xx(httpResponses: IHttpResponse[]): IHttpResponse | undefined {
        const generic2xxResponse = this.findResponseByStatusCode(httpResponses, '2XX');
        const sorted2xxResponses = httpResponses
            .filter(response => response.code.match(/2\d\d/))
            .sort((a: IHttpResponse, b: IHttpResponse) => Number(a.code) - Number(b.code));

        return sorted2xxResponses[0] || generic2xxResponse;
    }
}