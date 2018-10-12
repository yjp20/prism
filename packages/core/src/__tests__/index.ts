import { factory } from '../index';

describe('graph', () => {
  test('component functions pass the default component to user provided overrides', async () => {
    let defaultLoaderId = 0;
    let customLoaderId = 0;

    const createInstance = factory<any, any, any, any, { id: number }>({
      // the default loader, what implementations of prism define (prism-http, etc)
      loader: {
        load: async opts => {
          defaultLoaderId = opts && opts.id ? opts.id : 0;
          return [];
        },
      },
    });

    /**
     * the user imports createInstance from an implementation (like prism-http)
     * when creating an instance, the user can override any of the components, and receive the default component
     * as an argument
     */
    const prism = createInstance({
      loader: {
        load: async (opts, defaultLoader) => {
          /**
           * end user can call, or not call, the parent loader
           * calling it will invoke the default load function above, setting defaultLoaderId
           * this allows one to hook before and after components functions are run,
           * and add their own custom logic, change the options passed through, or skip altogether
           */
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

  test('load calls loader and sets resources', async () => {
    const createInstance = factory<any, any, any, any, { id: number }>({
      loader: {
        load: async opts => {
          return [opts ? opts.id : 0];
        },
      },
    });

    const prism = createInstance();
    await prism.load({ id: 123 });
    expect(prism.resources).toEqual([123]);
  });

  describe('process', () => {
    test.skip('calls router to find the resource match', () => {
      // TODO
    });

    test.skip('runs validator on input', () => {
      // TODO
    });

    test.skip('calls mocker if config mock property is truthy', () => {
      // TODO
    });

    test.skip('calls forwarder if config mock property is falsy', () => {
      // TODO
    });

    test.skip('calls validator on output', () => {
      // TODO
    });
  });
});
