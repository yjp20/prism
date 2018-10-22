import { PrismConfig, PrismConfigFactory } from '@stoplight/prism-core/types';
import { IHttpConfig, IHttpOperationConfig, IHttpRequest } from '@stoplight/prism-http/types';

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
  const query = req.url.query;
  if (!query) {
    return config;
  }

  const { __code, __dynamic, __contentType, __example } = query;

  const httpOperationConfig: IHttpOperationConfig = {
    code: __code,
    dynamic: __dynamic && __dynamic.toLowerCase() === 'true' ? true : false,
    mediaType: __contentType,
    exampleKey: __example,
  };

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
