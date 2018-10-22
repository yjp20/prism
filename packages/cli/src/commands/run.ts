import server from '@stoplight/prism-http-server';

function handler() {

}

export default {
  command: 'run',
  aliases: ['start'],
  describe: 'Start a server with the given spec file.',
  builder() {
    return null;
  },
  handler,
};
