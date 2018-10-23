import { createServer } from '@stoplight/prism-http-server';

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

function handler(argv: any) {
  console.log('Starting a Prism server', argv);
  createServer({ path: argv.spec })
    .listen(argv.port)
    .then(console.log, console.log);
}

export default {
  command: 'run',
  aliases: ['start'],
  describe: 'Start a server with the given spec file.',
  handler,
};
