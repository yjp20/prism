import { factory, filesystemLoader, IFilesystemLoaderOpts } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import { forwarder } from './forwarder';
import { HttpMocker } from './mocker';
import { JSONSchemaExampleGenerator } from './mocker/generator/JSONSchemaExampleGenerator';
import { router } from './router';
import {
  IHttpConfig,
  IHttpMethod,
  IHttpOperationConfig,
  IHttpRequest,
  IHttpResponse,
  TPrismHttpComponents,
  TPrismHttpInstance,
} from './types';
import { validator } from './validator';

const createInstance = <LoaderInput = IFilesystemLoaderOpts>(
  overrides: TPrismHttpComponents<LoaderInput>
) => {
  return factory<IHttpOperation, IHttpRequest, IHttpResponse, IHttpConfig, LoaderInput>({
    config: {
      mock: true,
    },
    loader: filesystemLoader,
    router,
    forwarder,
    validator,
    mocker: new HttpMocker(new JSONSchemaExampleGenerator()),
  })(overrides);
};

export {
  IHttpConfig,
  IHttpMethod,
  IHttpRequest,
  IHttpResponse,
  createInstance,
  TPrismHttpInstance,
  IHttpOperationConfig,
  TPrismHttpComponents,
};
