import * as yargs from 'yargs';
import run from './commands/run';

yargs
  .command(run)
  .demandCommand()
  .help()
  .parse();
