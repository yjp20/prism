import {
  IFilesystemLoaderOpts,
  IPrism,
  IPrismComponents,
  IPrismConfig,
} from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

export type TPrismHttpInstance<LoaderInput = IFilesystemLoaderOpts> = IPrism<
  IHttpOperation,
  IHttpRequest,
  IHttpResponse,
  IHttpConfig,
  LoaderInput
>;

export type TPrismHttpComponents<LoaderInput = IFilesystemLoaderOpts> = Partial<
  IPrismComponents<IHttpOperation, IHttpRequest, IHttpResponse, IHttpConfig, LoaderInput>
>;

// TODO: should be complete | and in the @stoplight/types repo
export type IHttpMethod =
  | 'get'
  | 'put'
  | 'post'
  | 'delete'
  | 'options'
  | 'head'
  | 'patch'
  | 'trace'; // ... etc

export interface IHttpOperationConfig {
  mediaType?: string;
  code?: string;
  exampleKey?: string;
  dynamic?: boolean;
}

export interface IHttpConfig extends IPrismConfig {
  mock: boolean | IHttpOperationConfig;

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
    baseUrl?: string;
    path: string;
    query?: {
      [name: string]: string;
    };
  };
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
