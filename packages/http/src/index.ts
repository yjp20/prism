import { factory, filesystemLoader, IFilesystemLoaderOpts } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import { forwarder } from './forwarder';
import { HttpMocker } from './mocker';
import { JSONSchemaExampleGenerator } from './mocker/generator/JSONSchemaExampleGenerator';
import { router } from './router';
import { IHttpConfig, IHttpMethod, IHttpRequest, IHttpResponse } from './types';
import { validator } from './validator';

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
