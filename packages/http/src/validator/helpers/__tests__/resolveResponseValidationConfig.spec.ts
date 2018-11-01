import { resolveResponseValidationConfig } from '../config';

describe('resolveResponseValidationConfig()', () => {
  const defaultEnabledConfig = {
    headers: true,
    body: true,
  };

  const defaultDisabledConfig = {
    headers: false,
    body: false,
  };

  describe('config is not set', () => {
    it('resolves to default response config', () => {
      expect(resolveResponseValidationConfig()).toEqual(defaultEnabledConfig);
    });
  });

  describe('config is set', () => {
    describe('config.validate is not set', () => {
      it('resolves to default config', () => {
        expect(resolveResponseValidationConfig({ mock: true })).toEqual(defaultEnabledConfig);
      });
    });

    describe('config.validate is set', () => {
      describe('config.validate.response is not set', () => {
        it('resolves to default config', () => {
          expect(resolveResponseValidationConfig({ mock: true, validate: {} })).toEqual(
            defaultEnabledConfig
          );
        });
      });

      describe('config.validate.request is set', () => {
        describe('response is a boolean', () => {
          describe('response is set to true', () => {
            it('resolves to all-enabled config', () => {
              expect(
                resolveResponseValidationConfig({ mock: true, validate: { response: true } })
              ).toEqual(defaultEnabledConfig);
            });
          });

          describe('response is set to false', () => {
            it('response to all-disabled config', () => {
              expect(
                resolveResponseValidationConfig({ mock: true, validate: { response: false } })
              ).toEqual(defaultDisabledConfig);
            });
          });
        });

        describe('response is an object', () => {
          describe('none parameters are set', () => {
            it('resolves to default config', () => {
              expect(
                resolveResponseValidationConfig({ mock: true, validate: { response: {} } })
              ).toEqual(defaultEnabledConfig);
            });
          });

          describe('all parameters are set', () => {
            it('resolves to given config', () => {
              expect(
                resolveResponseValidationConfig({
                  mock: true,
                  validate: { response: defaultDisabledConfig },
                })
              ).toEqual(defaultDisabledConfig);
            });
          });
        });
      });
    });
  });
});
