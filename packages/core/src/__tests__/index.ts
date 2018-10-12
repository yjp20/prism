import { factory } from '../index';

describe('graph', () => {
  describe('components', () => {
    test('pass the default component to user provided overrides', async () => {
      let defaultLoaderId = 0;
      let customLoaderId = 0;

      const createInstance = factory<any, any, any, any, { id: number }>({
        loader: {
          load: async opts => {
            defaultLoaderId = opts && opts.id ? opts.id : 0;
            return [];
          },
        },
      });

      const prism = createInstance({
        loader: {
          load: async (opts, defaultLoader) => {
            // end user can call, or not call, the parent loader
            // calling it will invoke the default load function above, setting defaultLoaderId
            // this allows one to hook before and after components functions are run,
            // and add their own custom logic, change the options passed through, or skip altogether
            if (defaultLoader) {
              await defaultLoader.load(opts);
            }

            customLoaderId = opts && opts.id ? opts.id : 0;
            return [];
          },
        },
      });

      await prism.load({ id: 123 });

      expect(defaultLoaderId).toEqual(123);
      expect(customLoaderId).toEqual(123);
    });
  });
});
