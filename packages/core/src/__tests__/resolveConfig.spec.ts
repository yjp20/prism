import { resolveConfig } from '../utils/resolveConfig';

describe('resolveConfig', () => {
  test('given config is an object return that object', async () => {
    const config = {};
    const defaultConfig = {};
    expect(await resolveConfig<any, any>({}, config, defaultConfig)).toBe(config);
  });

  test('given config is a function return object resolved by that function', async () => {
    const configFn = jest.fn();
    const config = {};
    const input = {};
    const defaultConfig = {};
    configFn.mockResolvedValue(config);
    expect(await resolveConfig<any, any>(input, configFn, defaultConfig)).toBe(config);
    expect(configFn).toHaveBeenCalledTimes(1);
    expect(configFn).toHaveBeenCalledWith(input, defaultConfig);
  });
});
