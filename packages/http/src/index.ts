import { factory, filesystemLoader, IFilesystemLoaderOpts } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import { forwarder } from './forwarder';
import { mocker } from './mocker';
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
  config: {},
  loader: filesystemLoader,
  router,
  forwarder,
  validator,
  mocker,
});

export { IHttpConfig, IHttpMethod, IHttpRequest, IHttpResponse, createInstance };
