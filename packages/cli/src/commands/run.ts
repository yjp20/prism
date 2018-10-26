import { Command, flags as oflags } from '@oclif/command';
import { TPrismHttpComponents } from '@stoplight/prism-http';
import { createServer } from '@stoplight/prism-http-server';
import resources from '../resources';

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
    const { port, spec, mock } = flags;
    const components: TPrismHttpComponents<any> = {
      // TODO: remove once validator implemented
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
    const server = createServer({ path: spec }, { components });
    server
      .listen(port as number)
      .then(console.log)
      .catch(console.log);
  }
}
