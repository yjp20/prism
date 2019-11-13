import { IPrismComponents } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';
import fetch from 'node-fetch';
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
        };

        logRequest({
          logger,
          url,
          request: requestInit,
          prefix: `${chalk.grey('> ')}`,
        });

        return fetch(url, requestInit);
      }, toError),
      TaskEither.map(response => {
        const { status: statusCode, ...rest } = response;
        logResponse({
          logger,
          response: { statusCode, ...rest },
          prefix: `${chalk.grey('< ')}`,
        });
        return response;
      }),
      TaskEither.chain(parseResponse)
    )
  );

export default forward;
