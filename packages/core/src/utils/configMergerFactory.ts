import * as _ from 'lodash';
import { PrismConfig, PrismConfigFactory, resolveConfig } from '..';

/**
 * Merges all passed configs. Each next config wil override each previous config.
 */
export function configMergerFactory<C, I>(
  ...configs: Array<PrismConfig<C, I> | undefined>
): PrismConfigFactory<C, I> {
  return async (input: I, defaultConfig?: PrismConfig<C, I>): Promise<C> => {
    let mergedConfigObject;
    for (const config of configs) {
      if (config !== undefined) {
        mergedConfigObject = _.merge(
          mergedConfigObject || {},
          await resolveConfig<C, I>(input, config, defaultConfig)
        );
      }
    }
    if (mergedConfigObject === undefined) {
      throw new Error('All configurations passed to the factory are undefined');
    }
    return mergedConfigObject;
  };
}
