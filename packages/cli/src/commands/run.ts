import { Command, flags as oflags } from '@oclif/command';
import { TPrismHttpComponents } from '@stoplight/prism-http';
import { createServer } from '@stoplight/prism-http-server';
import resources from '../resources';

// NAME:
//    prism run - Start a server with the given spec file.

// USAGE:
//    prism run [command options] [arguments...]

// OPTIONS:
//    --config, -c value    File path to a Prism config.json file.
//    --spec, -s value      File path or URL to swagger 2 spec.
//    --port, -p value      Port that Prism will run on, defaults to 4010. (default: 4010)
//    --mock, -m                  Turn global mocking on or off, defaults to off.
//    --mockDynamic, --md         Turn global dynamic mocking on or off, defaults to off.
//    --list, -l                  Pretty print endpoints path + method at start.
//    --validate, --vl            Validate the passed in spec at start.
//    --debug, -d                 Turn debug on or off, defaults to off.
//    --cors, --co                Turn CORS on, defaults to off.
//    --variable, -v value  Overwrite enviroment variables, key=value.

export default class Run extends Command {
  public static description = 'Start a server with the given spec file';
  public static flags = {
    port: oflags.integer({
      char: 'p',
      description: 'Port that Prism will run on.',
      default: 4010,
    }),
    spec: oflags.string({
      char: 's',
      description: 'File path or URL to the spec.',
      required: true,
    }),
    mock: oflags.boolean({
      char: 'm',
      description: 'Turn global mocking on or off',
      default: false,
    }),
  };

  public async run() {
    const { flags } = this.parse(Run);
    const path = '';
    const { port, mock } = flags;
    const components: TPrismHttpComponents<any> = {
      validator: undefined,
      // TODO: remove once loader implemented
      loader: {
        async load() {
          return resources;
        },
      },
    };
    if (!mock) {
      components.config = {
        mock: false,
      };
    }
    const server = createServer({ path }, { components });
    server
      .listen(port as number)
      .then(console.log)
      .catch(console.log);
  }
}
