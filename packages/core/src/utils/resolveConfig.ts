import { PrismConfig, PrismConfigFactory } from '../types';

export async function resolveConfig<Config, Input>(
  input: Input,
  config: PrismConfig<Config, Input>,
  defaultConfig?: PrismConfig<Config, Input>
): Promise<Config> {
  if (typeof config === 'function') {
    // config factory function
    return await (config as PrismConfigFactory<Config, Input>)(input, defaultConfig);
  }
  return config;
}
