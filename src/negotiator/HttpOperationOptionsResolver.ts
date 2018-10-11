import { IHttpOperationOptions, IHttpRequest } from "../types";

export class HttpOperationOptionsResolver {
    public resolve(httpRequest: IHttpRequest): Promise<IHttpOperationOptions> {
        const { _code: code, _example: exampleKey } = httpRequest.query;
        const mediaType = httpRequest.query._contentType || httpRequest.headers['Content-Type'];
        const dynamic = httpRequest.query._dynamic === 'true';
        return Promise.resolve({ code, mediaType, dynamic, exampleKey });
    }
}