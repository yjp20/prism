import { types } from '@stoplight/prism-core';
import { IHttpOperation, IServer } from '@stoplight/types';

import * as t from '../types';
import { matchPath } from './matchPath';
import { Nullable, IServerMatch, IMatch, PathWithServers, IPathMatch, MatchType } from './types';
import { matchServer } from './matchServer';

export const router: types.IRouter<IHttpOperation, t.IHttpRequest, t.IHttpConfig> = {
  route: async ({ resources, input, config }) => {
    return Promise.resolve(route(resources, input));
  },
};

function route(operations: IHttpOperation[], request: t.IHttpRequest) {
  return disambiguateMatches(<IMatch[]>operations
    .map(operation => match(request, operation))
    .filter(match => match !== null)
  );
}

function match(request: t.IHttpRequest, operation: IHttpOperation): Nullable<IMatch> {
  if (!matchByMethod(request, operation)) {
    return null;
  }
  return matchByUrl(request, operation);
}

function matchByUrl(request: t.IHttpRequest, operation: IHttpOperation): Nullable<IMatch> {
  const pathWithServers = matchPathWithServers(operation.servers, request.url, operation);
  if (pathWithServers === null) {
    return null
  };

  const matchingServer = disambiguateServers(pathWithServers.matchingServers);

  return {
    operation,
    matchingPair: [matchingServer, pathWithServers.pathMatch]
  }
}

function matchPathWithServers(servers: IServer[], requestUrl: URL, operation: IHttpOperation): Nullable<PathWithServers> {
  let pathMatchResult = null;
  const matchingServers: IServerMatch[] = [];
  for (let server of servers) {
    const serverMatch = matchServer(server, requestUrl);
    if (!serverMatch) continue;
    const pathMatch = matchPath(serverMatch.path, operation);
    if (!pathMatch) continue;
    pathMatchResult = pathMatch;
  }

  if (pathMatchResult === null) {
    return null;
  }

  return {
    pathMatch: pathMatchResult,
    matchingServers,
  };
}

function matchByMethod(request: t.IHttpRequest, operation: IHttpOperation): boolean {
  return operation.method.toLowerCase() === request.method.toLowerCase();
}

export function disambiguateMatches(matches: IMatch[]): IHttpOperation {
  const match = (
    // prefer concrete server and concrete path
    matches.find(match => areServerAndPath(match, 'concrete', 'concrete')) ||
    // then prefer templated server and concrete path
    matches.find(match => areServerAndPath(match, 'templated', 'concrete')) ||
    // then prefer concrete server and templated path
    matches.find(match => areServerAndPath(match, 'concrete', 'templated')) ||
    // then prefer templated server and templated path
    matches.find(match => areServerAndPath(match, 'templated', 'templated')) ||
    // then fallback to first
    matches[0]
  );
  return match.operation;
}

function areServerAndPath(match: IMatch, serverType: MatchType, pathType: MatchType) {
  return isServerMatchOfType(match.matchingPair[0], serverType) &&
    isPathMatchOfType(match.matchingPair[1], pathType);
}

/**
 * If a concrete server match exists then return first such match.
 * If no concrete server match exists return first (templated) match.
 */
function disambiguateServers(serverMatches: IServerMatch[]): IServerMatch {
  const concreteMatch = serverMatches.find(serverMatch => isServerMatchOfType(serverMatch, 'concrete'));
  return concreteMatch || serverMatches[0];
}

function isServerMatchOfType(serverMatch: IServerMatch, type: MatchType): boolean {
  return type === 'concrete' ? !serverMatch.variables : !!serverMatch.variables
}

function isPathMatchOfType(pathMatch: IPathMatch, type: MatchType): boolean {
  return type === 'concrete' ? typeof pathMatch === 'boolean' : typeof pathMatch !== 'boolean';
}
