import { types } from '@stoplight/prism-core';
import { IHttpOperation, IServer } from '@stoplight/types';

import * as t from '../types';

type Nullable<T> = T | null;

export const router: types.IRouter<IHttpOperation, t.IHttpRequest, t.IHttpConfig> = {
  route: async ({ resources, input, config }) => {
    throw new Error('Not implemented yet');
  },
};

function route(operations: IHttpOperation[], request: t.IHttpRequest) {
  return disambiguate(<IMatch[]>operations
    .map(operation => match(request, operation))
    .filter(match => match !== null)
  );
}

interface IMatch {
  operation: IHttpOperation;
  possibleMatches: [IServerMatch, IPathMatch][];
}

function match(request: t.IHttpRequest, operation: IHttpOperation): Nullable<IMatch> {
  if (!matchByMethod(request, operation)) {
    return null;
  }
  return matchByUrl(request, operation);
}

function matchByUrl(request: t.IHttpRequest, operation: IHttpOperation): Nullable<IMatch> {
  const requestUrl = request.url;
  const { path, servers } = operation;
  const possibleMatches = <[IServerMatch, IPathMatch][]>servers
    .map(server => {
      const serverMatch = matchServer(server, requestUrl);
      if (!serverMatch) return null;
      const pathMatch = matchPath(serverMatch.path, operation);
      if (!pathMatch) return null;
      return [serverMatch, pathMatch];
    })
    .filter(match => match !== null);

  if (!possibleMatches.length) return null;

  return {
    operation,
    possibleMatches
  }
}



interface IServerMatch {
  baseUrl: string;
  path: string;
  variables: {};
}

function matchPath(requestPath: string, operation: IHttpOperation): IPathMatch {
  throw new Error('not implemented');
}

function matchServer(server: IServer, requestUrl: URL): IServerMatch {
  throw new Error('not implemneted');
}

function matchByMethod(request: t.IHttpRequest, operation: IHttpOperation): boolean {
  throw new Error('Not implemented');
}

function disambiguate(matches: IMatch[]): IMatch {
  throw new Error('Not implemented');
}
