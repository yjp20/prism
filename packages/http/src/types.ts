import { types } from '@stoplight/prism-core';

// TODO: should be complete | and in the @stoplight/types repo
export type IHttpMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'; // ... etc

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
  url: {
    baseUrl: string;
    path: string;
    query?: {
      [name: string]: string;
    };
  }
  headers?: {
    [name: string]: string;
  };
  body?: any;
}

export interface IHttpResponse {
  statusCode: number;
  headers?: {
    [name: string]: string;
  };
  body?: any;
}
