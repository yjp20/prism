import { filesystemLoader } from './loaders/filesystem';
import * as types from './types';

export { types, filesystemLoader };

export function factory<Resource, Input, Output, Config, LoadOpts>(
  defaultComponents: Partial<types.IPrismComponents<Resource, Input, Output, Config, LoadOpts>>
): (
  componentOverrides?: Partial<types.IPrismComponents<Resource, Input, Output, Config, LoadOpts>>
) => types.IPrism<Input, Output, Config, LoadOpts> {
  return componentOverrides => {
    // allow consumer to override default components if they wish
    const components: Partial<
      types.IPrismComponents<Resource, Input, Output, Config, LoadOpts>
    > = Object.assign({}, defaultComponents, componentOverrides);

    // our loaded resources (HttpOperation objects, etc)
    let resources: Resource[] = [];

    return {
      load: async opts => {
        const l = components.loader;
        if (l) {
          resources = await l.load(opts);
        } else {
          // TODO: use reporter to report a warning
        }
      },

      process: async (input, c) => {
        const currentConfig = c || components.config;

        // build the config for this request
        let configObj: Config | undefined;
        if (currentConfig instanceof Function) {
          configObj = await (currentConfig as types.PrismConfigFactory<Config, Input>)(input);
        } else if (currentConfig) {
          configObj = currentConfig as Config;
        }

        // find the correct resource
        let resource: Resource | undefined;
        if (components.router) {
          resource = await components.router.route({ resources, input, config: configObj });
        }

        // validate input
        let inputValidations: types.IValidation[] = [];
        if (resource && components.validator && components.validator.validateInput) {
          inputValidations = await components.validator.validateInput({
            resource,
            input,
            config: configObj,
          });
        }

        // build output
        let output: Output | undefined;
        if (resource && components.mocker && (configObj as types.IPrismConfig).mock) {
          // generate the response
          output = await components.mocker.mock({
            resource,
            input: { validations: { input: inputValidations }, data: input },
            config: configObj,
          });
        } else if (components.forwarder) {
          // forward request and set output from response
          output = await components.forwarder.forward({
            resource,
            input: { validations: { input: inputValidations }, data: input },
            config: configObj,
          });
        }

        // validate output
        let outputValidations: types.IValidation[] = [];
        if (resource && components.validator && components.validator.validateOutput) {
          outputValidations = await components.validator.validateOutput({
            resource,
            output,
            config: configObj,
          });
        }

        return {
          input,
          output,
          validations: {
            input: inputValidations,
            output: outputValidations,
          },
        };
      },
    };
  };
}
