import { IHttpOperationConfig, IHttpRequest } from "@stoplight/prism-http/types";
import { IHttpContent, IHttpResponse, IHttpOperation } from "@stoplight/types/http";

function findBestExample(httpContent: IHttpContent) {
    return httpContent.examples && httpContent.examples[0];
}

function findExampleByKey(httpContent: IHttpContent, exampleKey: string) {
    return httpContent.examples && httpContent.examples.find(example => example.key === exampleKey);
}

function findHttpContentByMediaType(response: IHttpResponse, mediaType: string): IHttpContent | undefined {
    return response.content.find(content => content.mediaType === mediaType);
}

function findLowest2xx(httpResponses: IHttpResponse[]): IHttpResponse | undefined {
    const generic2xxResponse = findResponseByStatusCode(httpResponses, '2XX');
    const sorted2xxResponses = httpResponses
        .filter(response => response.code.match(/2\d\d/))
        .sort((a: IHttpResponse, b: IHttpResponse) => Number(a.code) - Number(b.code));

    return sorted2xxResponses[0] || generic2xxResponse;
}

function findResponseByStatusCode(responses: IHttpResponse[], statusCode: string): IHttpResponse | undefined {
    return responses.find(response => response.code.toLowerCase() === statusCode.toLowerCase());
}

const helpers = {
    negotiateByPartialOptionsAndHttpContent(partialOptions: IHttpOperationConfig, httpContent: IHttpContent): IHttpOperationConfig {
        const { code, exampleKey, dynamic } = partialOptions;
        const { mediaType } = httpContent;

        if (exampleKey) {
            // the user provided exampleKey - highest priority
            const example = findExampleByKey(httpContent, exampleKey);
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
            const example = findBestExample(httpContent);
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
    },

    negotiateDefaultMediaType(partialOptions: Partial<IHttpOperationConfig>, response: IHttpResponse): IHttpOperationConfig {
        const { code, dynamic, exampleKey } = partialOptions;
        const mediaType = 'application/json';
        let httpContent = findHttpContentByMediaType(response, mediaType);
        if (httpContent) {
            // a httpContent for default mediaType exists
            return helpers.negotiateByPartialOptionsAndHttpContent({
                mediaType,
                code,
                dynamic,
                exampleKey
            }, httpContent);
        }
        // a httpContent for default mediaType does not exist
        throw new Error('Could not generate response for provided content type or no content type provided. Tried to fallback to application/json, but no definition found.');
    },

    negotiateOptionsBySpecificResponse(httpOperation: IHttpOperation, desiredOptions: IHttpOperationConfig, httpRequest: IHttpRequest, response: IHttpResponse): IHttpOperationConfig {
        const { code } = response;
        let { mediaType, dynamic, exampleKey } = desiredOptions;

        if (mediaType) {
            // a user provided mediaType
            let httpContent = findHttpContentByMediaType(response, mediaType);
            if (httpContent) {
                // a httpContent for a provided mediaType exists
                return helpers.negotiateByPartialOptionsAndHttpContent({
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
        return helpers.negotiateDefaultMediaType({
            code,
            dynamic,
            exampleKey
        }, response);
    },

    negotiateOptionsForDefaultCode(httpOperation: IHttpOperation, desiredOptions: IHttpOperationConfig, httpRequest: IHttpRequest): IHttpOperationConfig {
        const lowest2xxResponse = findLowest2xx(httpOperation.responses);
        if (lowest2xxResponse) {
            return helpers.negotiateOptionsBySpecificResponse(httpOperation, desiredOptions, httpRequest, lowest2xxResponse);
        }
        throw new Error('No 2** response defined, cannot mock');
    },

    negotiateOptionsBySpecificCode(httpOperation: IHttpOperation, desiredOptions: IHttpOperationConfig, httpRequest: IHttpRequest, code: string): IHttpOperationConfig {
        // find response by provided status code
        const responseByForcedStatusCode = findResponseByStatusCode(httpOperation.responses, code);
        if (responseByForcedStatusCode) {
            try {
                // try to negotiate
                return helpers.negotiateOptionsBySpecificResponse(httpOperation, desiredOptions, httpRequest, responseByForcedStatusCode);
            } catch (error) {
                // if negotiations fail try a default code
                return helpers.negotiateOptionsForDefaultCode(httpOperation, desiredOptions, httpRequest);
            }
        }
        // if no response found under a status code, try to mock a default code
        return helpers.negotiateOptionsForDefaultCode(httpOperation, desiredOptions, httpRequest);
    },

    negotiateOptionsForValidRequest(httpOperation: IHttpOperation, desiredOptions: IHttpOperationConfig, httpRequest: IHttpRequest): IHttpOperationConfig {
        let { code } = desiredOptions;
        if (code) {
            return helpers.negotiateOptionsBySpecificCode(httpOperation, desiredOptions, httpRequest, code);
        }
        return helpers.negotiateOptionsForDefaultCode(httpOperation, desiredOptions, httpRequest);
    },

    negotiateOptionsForInvalidRequest(httpResponses: IHttpResponse[], httpRequest: IHttpRequest): IHttpOperationConfig {
        // currently only try to find a 400 response, but we may want to support other cases in the future
        const code = '400';
        const response = findResponseByStatusCode(httpResponses, code);
        // TODO: what if no 400 response is defined?
        if (!response) {
            throw new Error('No 400 response defined');
        }
        // find first response with any static examples
        const responseWithExamples = response.content.find(content => !!content.examples && content.examples.length !== 0);
        // find first response with a schema
        const responseWithSchema = response.content.find(content => !!content.schema);

        if (responseWithExamples) {
            return {
                code,
                mediaType: responseWithExamples.mediaType,
                exampleKey: responseWithExamples.examples![0].key
            }
        } else if (responseWithSchema) {
            return {
                code,
                mediaType: responseWithSchema.mediaType,
                dynamic: true
            };
        } else {
            throw new Error('Data corrupted');
        }
    },
};

export default helpers;
