import { factory, filesystemLoader } from '@stoplight/prism-core';
import { IFilesystemLoaderOpts } from '@stoplight/prism-core/types';
import { IHttpOperation } from '@stoplight/types';

import { forwarder } from './forwarder';
import { mocker } from './mocker';
import { router } from './router';
import { IHttpConfig, IHttpRequest, IHttpResponse } from './types';
import * as types from './types';
import { validator } from './validator';

export { types };

export const createInstance = factory<
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
  mocker,
});
