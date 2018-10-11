import { IHttpOperation } from "@stoplight/types";

// we need an interface we can implement with a little fuss that will be compatible
// with node and browsers.
// We can either come up with our own interface or inherit from existing interfaces (node http request, express http request)
// Refs: 
// - https://expressjs.com/en/api.html
// - https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html 

export interface IHttpRequest {
    // parameters from the query string
    query: { [key:string]: string };
    headers: { [key: string]: string };
}

export interface IHttpOperationOptionsNegotiationResult {
    readonly httpOperationOptions?: IHttpOperationOptions;
    readonly error?: Error;
}

export interface IHttpOperationOptions {
    // TODO: I decided to rename 'contentType' to 'mediaType' to make it compatible with IHttpOperationNode
    readonly mediaType?: string;
    // HTTP status code (200, 300, etc...)
    readonly code?: string;
    // A unique key (id) of an example to return
    readonly exampleKey?: string;
    readonly headers?: boolean;
    // whether to generate a response from a schema or not
    readonly dynamic?: boolean;
}

export interface IHttpRequestValidationResult {
    readonly isValid: boolean;
}

export interface IHttpRequestValidator {
    validate(httpOperation: IHttpOperation, httpRequest: IHttpRequest): IHttpRequestValidationResult;
}