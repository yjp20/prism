import {
  factory,
  filesystemLoader,
  IFilesystemLoaderOpts,
  IPrism,
  IPrismComponents,
} from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import { forwarder } from './forwarder';
import { HttpMocker } from './mocker';
import { JSONSchemaExampleGenerator } from './mocker/generator/JSONSchemaExampleGenerator';
import { router } from './router';
import { IHttpConfig, IHttpMethod, IHttpRequest, IHttpResponse } from './types';
import { validator } from './validator';

export type TPrismHttpInstance = IPrism<
  IHttpOperation,
  IHttpRequest,
  IHttpResponse,
  IHttpConfig,
  IFilesystemLoaderOpts
>;

export type TPrismHttpComponents = Partial<
  IPrismComponents<IHttpOperation, IHttpRequest, IHttpResponse, IHttpConfig, IFilesystemLoaderOpts>
>;

const createInstance = factory<
  IHttpOperation,
  IHttpRequest,
  IHttpResponse,
  IHttpConfig,
  IFilesystemLoaderOpts
>({
  config: {
    mock: true,
  },
  loader: filesystemLoader,
  router,
  forwarder,
  validator,
  mocker: new HttpMocker(new JSONSchemaExampleGenerator()),
});

export { IHttpConfig, IHttpMethod, IHttpRequest, IHttpResponse, createInstance };
