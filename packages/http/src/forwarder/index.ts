import { IPrismComponents } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';
import fetch, { Response } from 'node-fetch';
import * as Either from 'fp-ts/lib/Either';
import * as TaskEither from 'fp-ts/lib/TaskEither';
import * as ReaderTaskEither from 'fp-ts/lib/ReaderTaskEither';
import { defaults, omit, pick } from 'lodash';
import { format, parse } from 'url';
import { IHttpConfig, IHttpRequest, IHttpResponse } from '../types';
import { posix } from 'path';
import { parseResponse } from '../utils/parseResponse';
import { pipe } from 'fp-ts/lib/pipeable';
import { logRequest, logResponse } from '../utils/logger';
import { Logger } from 'pino';
import chalk from 'chalk';
import withLogger from '../withLogger';
import { serializeBody } from '../utils/serializeBody';

const { version: prismVersion } = require('../../package.json');

const forward: IPrismComponents<IHttpOperation, IHttpRequest, IHttpResponse, IHttpConfig>['forward'] = (
  input: IHttpRequest,
  baseUrl: string
): ReaderTaskEither.ReaderTaskEither<Logger, Error, IHttpResponse> =>
  withLogger(logger =>
    pipe(
      TaskEither.fromEither(serializeBody(input.body)),
      TaskEither.chain(body =>
        TaskEither.tryCatch(async () => {
          const partialUrl = parse(baseUrl);
          const url = format({
            ...partialUrl,
            pathname: posix.join(partialUrl.pathname || '', input.url.path),
            query: input.url.query,
          });

          logForwardRequest({ logger, url, request: input });

          return fetch(url, {
            body,
            method: input.method,
            headers: defaults(omit(input.headers, ['host', 'accept']), {
              accept: 'application/json, text/plain, */*',
              'user-agent': `Prism/${prismVersion}`,
            }),
          });
        }, Either.toError)
      ),
      TaskEither.map(forwardResponseLogger(logger)),
      TaskEither.chain(parseResponse)
    )
  );

export default forward;

function logForwardRequest({ logger, url, request }: { logger: Logger; url: string; request: IHttpRequest }) {
  const prefix = `${chalk.grey('> ')}`;
  logger.info(`${prefix}Forwarding "${request.method}" request to ${url}...`);
  logRequest({ logger, prefix, ...pick(request, 'body', 'headers') });
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
  };
}
