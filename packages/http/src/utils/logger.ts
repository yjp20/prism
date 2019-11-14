import withLogger from '../withLogger';
import { Dictionary, DiagnosticSeverity } from '@stoplight/types';
import { IPrismDiagnostic } from '@stoplight/prism-core';
import { Logger } from 'pino';
import { BodyInit, Headers, RequestInit } from 'node-fetch';
import { pipe } from 'fp-ts/lib/pipeable';
import * as Option from 'fp-ts/lib/Option';
import chalk from 'chalk';

import { IHttpNameValue, IHttpResponse } from '../types';

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

export function logRequest({ logger, prefix = '', request: { headers, body } }: { logger: Logger, prefix?: string, request: Pick<RequestInit, 'headers' | 'body'> }) {
  pipe(
    Option.fromNullable(headers),
    Option.map(headers => logHeaders({
      logger,
      prefix,
      headers,
    })),
  );

  pipe(
    Option.fromNullable(body),
    Option.map(body => logBody({
      logger,
      prefix,
      body,
    })),
  );
}

export function logResponse(
  { logger, prefix = '', response }: { logger: Logger, prefix?: string, response: { statusCode: number, headers?: IHttpNameValue | Headers, body?: unknown } }) {

  logger.debug(`${prefix}${chalk.grey('Status:')} ${response.statusCode}`);

  pipe(
    Option.fromNullable(response.headers),
    Option.map(headers => logHeaders({
      logger,
      prefix,
      headers,
    })),
  );

  pipe(
    Option.fromNullable(response.body),
    Option.map(body => logBody({
      logger,
      prefix,
      body,
    })),
  );
}
