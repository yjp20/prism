import withLogger from '../withLogger';
import { DiagnosticSeverity } from '@stoplight/types';
import { IPrismDiagnostic } from '@stoplight/prism-core';
import { Logger } from 'pino';
import { BodyInit, Headers } from 'node-fetch';
import { Dictionary } from '@stoplight/types/dist';
import { pipe } from 'fp-ts/lib/pipeable';
import * as Option from 'fp-ts/lib/Option';
import chalk from 'chalk';

export const violationLogger = withLogger(logger => {
  return (violation: IPrismDiagnostic) => {
    const path = violation.path ? violation.path.join('.') + ' ' : '';
    const message = `Violation: ${path}${violation.message}`;
    if (violation.severity === DiagnosticSeverity.Error) {
      logger.error({ name: 'VALIDATOR' }, message);
    } else if (violation.severity === DiagnosticSeverity.Warning) {
      logger.warn({ name: 'VALIDATOR' }, message);
    } else {
      logger.info({ name: 'VALIDATOR' }, message);
    }
  };
});

export function logHeaders({ logger, prefix = '', headers }: { logger: Logger, prefix: string, headers: Headers | Dictionary<string> | string[][] }) {
  pipe(
    pipe(
      headers,
      Option.fromPredicate(headers => Array.isArray(headers))
    ) as Option.Option<string[][]>,
    Option.alt(() => Option.some(Object.entries(headers) as string[][])),
    Option.map(headers => {
      logger.debug(`${prefix}${chalk.grey('Headers:')}`);
      headers.forEach(([ name, value ]) => logger.debug(`${prefix}\t${name}: ${value}`));
    }),
  );
}

export function logBody({ logger, prefix = '', body }: { logger: Logger, prefix: string, body: BodyInit | unknown }) {
  logger.debug(`${prefix}${chalk.grey('Body:')} ${body}`);
}
