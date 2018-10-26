import { PrismConfig, PrismConfigFactory, resolveConfig } from '@stoplight/prism-core';
import { IHttpConfig, IHttpRequest } from '@stoplight/prism-http';

export const getHttpConfigFromRequest: PrismConfigFactory<IHttpConfig, IHttpRequest> = async (
  req: IHttpRequest,
  defaultConfig?: PrismConfig<IHttpConfig, IHttpRequest>
) => {
  const config: IHttpConfig = defaultConfig
    ? await resolveConfig<IHttpConfig, IHttpRequest>(req, defaultConfig)
    : { mock: true };
  const httpOperationConfig: any = {};
  const query = req.url.query;

  if (!query) {
    return config;
  }

  const { __code, __dynamic, __contentType, __example } = query;

  if (__code) {
    httpOperationConfig.code = __code;
  }

  if (__dynamic) {
    httpOperationConfig.dynamic = __dynamic.toLowerCase() === 'true';
  }

  if (__contentType) {
    httpOperationConfig.mediaType = __contentType;
  }

  if (__example) {
    httpOperationConfig.exampleKey = __example;
  }

  if (Object.keys(httpOperationConfig).length) {
    if (typeof config.mock === 'boolean') {
      config.mock = httpOperationConfig;
    } else {
      config.mock = Object.assign({}, config.mock, httpOperationConfig);
    }
    return config;
  }

  return config;
};
