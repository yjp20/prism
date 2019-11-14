import { IPrismComponents } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';
import fetch, { RequestInit, Response } from 'node-fetch';
import { toError } from 'fp-ts/lib/Either';
import * as TaskEither from 'fp-ts/lib/TaskEither';
import * as ReaderTaskEither from 'fp-ts/lib/ReaderTaskEither';
import { defaults, omit } from 'lodash';
import { format, parse } from 'url';
import { IHttpConfig, IHttpRequest, IHttpResponse } from '../types';
import { posix } from 'path';
import { parseResponse } from '../utils/parseResponse';
import { pipe } from 'fp-ts/lib/pipeable';
import { logRequest, logResponse } from '../utils/logger';
import { Logger } from 'pino';
import chalk from 'chalk';
import withLogger from '../withLogger';

const { version: prismVersion } = require('../../package.json');

const forward: IPrismComponents<IHttpOperation, IHttpRequest, IHttpResponse, IHttpConfig>['forward'] = (
  input: IHttpRequest,
  baseUrl: string
): ReaderTaskEither.ReaderTaskEither<Logger, Error, IHttpResponse> =>
  withLogger(logger =>
    pipe(
      TaskEither.tryCatch(async () => {
        const partialUrl = parse(baseUrl);
        const url = format({
          ...partialUrl,
          pathname: posix.join(partialUrl.pathname || '', input.url.path),
          query: input.url.query,
        });
        const requestInit = {
          headers: defaults(omit(input.headers, ['host', 'accept']), {
            accept: 'application/json, text/plain, */*',
            'user-agent': `Prism/${prismVersion}`,
          }),
          method: input.method,
          // todo: add real type guard
          body: typeof input.body === 'string' ? input.body : JSON.stringify(input.body),
        };

        logForwardRequest({ logger, url, request: requestInit });

        return fetch(url, requestInit);
      }, toError),
      TaskEither.map(forwardResponseLogger(logger)),
      TaskEither.chain(parseResponse)
    )
  );

export default forward;

function logForwardRequest({ logger, url, request }: { logger: Logger, url: string, request: Pick<RequestInit, 'headers' | 'method' | 'body'> }) {
  const prefix = `${chalk.grey('> ')}`;
  logger.info(`${prefix}Forwarding "${request.method}" request to ${url}...`);
  logRequest({ logger, request, prefix });
}

function forwardResponseLogger(logger: Logger) {
  return (response: Response) => {
    const prefix = chalk.grey('< ');

    logger.info(`${prefix}Received forward response`);

    const { status: statusCode, ...rest } = response;

    logResponse({
      logger,
      response: { statusCode, ...rest },
      prefix,
    });

    return response;
  }
}
