import { types } from '@stoplight/prism-core';

// TODO: should be complete, and in the @stoplight/types repo
export type IHttpMethod = 'get' | 'put' | 'post' | 'delete'; // ... etc

export interface IHttpConfig extends types.IPrismConfig {
  mock?:
    | boolean
    | {
        code?: string | number;
        example?: string;
        dynamic?: boolean;
        mediaType?: string;
      };

  security?: {
    // TODO
  };

  validate?: {
    request?:
      | boolean
      | {
          hijack?: boolean;
          headers?: boolean;
          query?: boolean;
          body?: boolean;
        };

    response?:
      | boolean
      | {
          headers?: boolean;
          body?: boolean;
        };
  };
}

export interface IHttpRequest {
  method: IHttpMethod;
  path: string;
  host: string;
  query?: {
    [name: string]: string;
  };
  headers?: {
    [name: string]: string;
  };
  body?: any;
}

export interface IHttpResponse {
  headers: {
    [name: string]: string;
  };
  body: unknown;
}
