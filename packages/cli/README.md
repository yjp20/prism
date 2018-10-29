prism-cli
=========

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/prism-cli.svg)](https://npmjs.org/package/prism-cli)
[![Downloads/week](https://img.shields.io/npm/dw/prism-cli.svg)](https://npmjs.org/package/prism-cli)
[![License](https://img.shields.io/npm/l/prism-cli.svg)](https://github.com/chris-miaskowski/prism-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g prism-cli
$ prism-cli COMMAND
running command...
$ prism-cli (-v|--version|version)
prism-cli/0.0.0 linux-x64 node-v8.9.0
$ prism-cli --help [COMMAND]
USAGE
  $ prism-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`prism-cli hello [FILE]`](#prism-cli-hello-file)
* [`prism-cli help [COMMAND]`](#prism-cli-help-command)

## `prism-cli hello [FILE]`

describe the command here

```
USAGE
  $ prism-cli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ prism-cli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/chris-miaskowski/prism-cli/blob/v0.0.0/src/commands/hello.ts)_

## `prism-cli help [COMMAND]`

display help for prism-cli

```
USAGE
  $ prism-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.3/src/commands/help.ts)_
<!-- commandsstop -->

## Development

### Running

1. Run `tsc -b` before executing the script
2. Run `yarn link` to enjoin `prism` command in your global env.

### Debugging

1. `node --inspect ./bin/run run`
2. .vscode/launch.json
```
{
  "type": "node",
  "request": "attach",
  "name": "Attach",
  "port": 9229
},
```
3. Run VSCode debugger
4. Enjoy breakpoints in VSCode :)
