import { PrismConfig, PrismConfigFactory, resolveConfig } from '..';

const _compact = require('lodash/compact');
const _merge = require('lodash/merge');

/**
 * Merges all passed configs. Each next config wil override each previous config.
 */
export function configMergerFactory<C, I>(
  ...configs: Array<PrismConfig<C, I> | undefined>
): PrismConfigFactory<C, I> {
  return async (input: I, defaultConfig?: PrismConfig<C, I>): Promise<C> => {
    const resolvedConfigs = await Promise.all(
      // remove any falsy configs
      _compact(configs)
        // resolve each config (resolveConfig is async)
        .map((c: C) => resolveConfig<C, I>(input, c, defaultConfig))
    );

    // merge the configs over each other, in order
    return _merge({}, ...resolvedConfigs);
  };
}
