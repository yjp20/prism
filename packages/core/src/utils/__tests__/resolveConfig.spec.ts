import { resolveConfig } from '../index';

describe('resolveConfig', () => {
  test('given config is an object return that object', async () => {
    const config = {};
    const defaultConfig = {};
    const resolved = await resolveConfig<any, any>({}, config, defaultConfig);
    expect(resolved).toBe(config);
  });

  test('given config is a function return object resolved by that function', async () => {
    const configFn = jest.fn();
    const config = {};
    const input = {};
    const defaultConfig = {};
    configFn.mockResolvedValue(config);

    const resolved = await resolveConfig<any, any>(input, configFn, defaultConfig);
    expect(resolved).toBe(config);
    expect(configFn).toHaveBeenCalledTimes(1);
    expect(configFn).toHaveBeenCalledWith(input, defaultConfig);
  });
});
