import { resolveRequestValidationConfig } from '../resolveRequestValidationConfig';

describe('resolveRequestValidationConfig()', () => {
  const defaultEnabledConfig = {
    hijack: true,
    headers: true,
    query: true,
    body: true,
  };

  const defaultDisabledConfig = {
    hijack: false,
    headers: false,
    query: false,
    body: false,
  };

  describe('config is not set', () => {
    it('resolves to default config', () => {
      expect(resolveRequestValidationConfig()).toEqual(defaultEnabledConfig);
    });
  });

  describe('config is set', () => {
    describe('config.validate is not set', () => {
      it('resolves to default config', () => {
        expect(resolveRequestValidationConfig({ mock: true })).toEqual(defaultEnabledConfig);
      });
    });

    describe('config.validate is set', () => {
      describe('config.validate.request is not set', () => {
        it('resolves to default config', () => {
          expect(resolveRequestValidationConfig({ mock: true, validate: {} })).toEqual(
            defaultEnabledConfig
          );
        });
      });

      describe('config.validate.request is set', () => {
        describe('request is a boolean', () => {
          describe('request is set to true', () => {
            it('resolves to all-enabled config', () => {
              expect(
                resolveRequestValidationConfig({ mock: true, validate: { request: true } })
              ).toEqual(defaultEnabledConfig);
            });
          });

          describe('request is set to false', () => {
            it('request to all-disabled config', () => {
              expect(
                resolveRequestValidationConfig({ mock: true, validate: { request: false } })
              ).toEqual(defaultDisabledConfig);
            });
          });
        });

        describe('request is an object', () => {
          describe('none parameters are set', () => {
            it('resolves to default config', () => {
              expect(
                resolveRequestValidationConfig({ mock: true, validate: { request: {} } })
              ).toEqual(defaultEnabledConfig);
            });
          });

          describe('all parameters are set', () => {
            it('resolves to default config', () => {
              expect(
                resolveRequestValidationConfig({
                  mock: true,
                  validate: { request: defaultDisabledConfig },
                })
              ).toEqual(defaultDisabledConfig);
            });
          });
        });
      });
    });
  });
});
