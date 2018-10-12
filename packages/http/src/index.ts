import { factory, filesystemLoader, types as coreTypes } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import { forwarder } from './forwarder';
import { mocker } from './mocker';
import { router } from './router';
import * as types from './types';
import { validator } from './validator';

export { types };

export const createInstance = factory<
  IHttpOperation,
  types.IHttpRequest,
  types.IHttpResponse,
  types.IHttpConfig,
  coreTypes.IFilesystemLoaderOpts
>({
  config: {},
  loader: filesystemLoader,
  router,
  forwarder,
  validator,
  mocker,
});
