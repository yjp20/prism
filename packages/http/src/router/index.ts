import { types } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import * as t from '../types';
import { matchPath } from './matchPath';
import { IMatch, MatchType } from './types';
import { matchBaseUrl } from './matchBaseUrl';

export const router: types.IRouter<IHttpOperation, t.IHttpRequest, t.IHttpConfig> = {
  route: async ({ resources, input, config }) => {
    return Promise.resolve(route(resources, input));
  },
};

function route(resources: IHttpOperation[], request: t.IHttpRequest) {
  const matches = [];
  const { path: requestPath, baseUrl: requestBaseUrl } = request.url;

  for (let resource of resources) {
    if (!matchByMethod(request, resource)) continue;

    const pathMatch = matchPath(requestPath, resource.path);
    const serverMatches = [];

    for (let server of resource.servers) {
      const serverMatch = matchBaseUrl(server, requestBaseUrl)
      if (serverMatch !== MatchType.NOMATCH) {
        serverMatches.push(serverMatch);
      }
    }

    const serverMatch = disambiguateServers(serverMatches);

    if (serverMatch && pathMatch !== MatchType.NOMATCH) {
      matches.push({
        pathMatch,
        serverMatch,
        resource,
      });
    }
  }

  return disambiguateMatches(matches);
}

function matchByMethod(request: t.IHttpRequest, operation: IHttpOperation): boolean {
  return operation.method.toLowerCase() === request.method.toLowerCase();
}

export function disambiguateMatches(matches: IMatch[]): null | IHttpOperation {
  const match = (
    // prefer concrete server and concrete path
    matches.find(match => areServerAndPath(match, MatchType.CONCRETE, MatchType.CONCRETE)) ||
    // then prefer templated server and concrete path
    matches.find(match => areServerAndPath(match, MatchType.TEMPLATED, MatchType.CONCRETE)) ||
    // then prefer concrete server and templated path
    matches.find(match => areServerAndPath(match, MatchType.CONCRETE, MatchType.TEMPLATED)) ||
    // then fallback to first
    matches[0]
  );
  return match ? match.resource : null;
}

function areServerAndPath(match: IMatch, serverType: MatchType, pathType: MatchType) {
  return match.serverMatch === serverType && match.pathMatch === pathType;
}

/**
 * If a concrete server match exists then return first such match.
 * If no concrete server match exists return first (templated) match.
 */
function disambiguateServers(serverMatches: MatchType[]): MatchType {
  const concreteMatch = serverMatches.find(serverMatch => serverMatch === MatchType.CONCRETE);
  return concreteMatch || serverMatches[0];
}
