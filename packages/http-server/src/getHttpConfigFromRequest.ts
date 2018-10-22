import { PrismConfig, PrismConfigFactory } from '@stoplight/prism-core/types';
import { IHttpConfig, IHttpRequest } from '@stoplight/prism-http/types';

async function getConfig<Config, Input>(
  input: Input,
  config: PrismConfig<Config, Input>,
  defaultConfig?: PrismConfig<Config, Input>
): Promise<Config> {
  if (typeof config === 'function') {
    // config factory function
    return await (config as PrismConfigFactory<Config, Input>)(input, defaultConfig);
  }
  return config as Config;
}

export const getHttpConfigFromRequest: PrismConfigFactory<IHttpConfig, IHttpRequest> = async (
  req: IHttpRequest,
  defaultConfig?: PrismConfig<IHttpConfig, IHttpRequest>
) => {
  const config: IHttpConfig = defaultConfig
    ? await getConfig<IHttpConfig, IHttpRequest>(req, defaultConfig)
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
