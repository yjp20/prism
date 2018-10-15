import { IOperationOptions, Protocol } from '@stoplight/prism-core/mocker/types';

export interface IHttpOperationOptions extends IOperationOptions {
  protocol: Protocol.HTTP;
  // Defaults to the lowest 2xx status code
  status: string;
  // Defaults to application/json
  mediaType: string;
  // Defaults to content type
  example?: string;
  // If true mock back response headers
  headers?: boolean;
}
