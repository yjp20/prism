import { Command, flags as oflags } from '@oclif/command';
import { TPrismHttpComponents } from '@stoplight/prism-http';
import { createServer } from '@stoplight/prism-http-server';

export default class Serve extends Command {
  public static description = 'Start a server with the given spec file';
  public static flags = {
    port: oflags.integer({
      char: 'p',
      description: 'Port that Prism will run on.',
      default: 4010,
    }),
    spec: oflags.string({
      char: 's',
      description:
        'Path to a spec file or directory. Must be relative to current working directory.',
    }),
    mock: oflags.boolean({
      char: 'm',
      description: 'Turn global mocking on or off',
      default: false,
    }),
  };

  public async run() {
    const { flags } = this.parse(Serve);
    const { port, spec, mock } = flags;
    const components: TPrismHttpComponents<any> = !mock ? { config: { mock: false } } : {};
    const server = createServer({ path: spec }, { components });
    server
      .listen(port as number)
      .then(console.log)
      .catch(console.log);
  }
}
