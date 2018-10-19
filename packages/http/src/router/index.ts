import { IRouter } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import { IHttpConfig, IHttpRequest } from '../types';
import { matchBaseUrl } from './matchBaseUrl';
import { matchPath } from './matchPath';
import { IMatch, MatchType } from './types';

export const router: IRouter<IHttpOperation, IHttpRequest, IHttpConfig> = {
  route: async ({ resources, input }) => {
    const matches = [];
    const { path: requestPath, baseUrl: requestBaseUrl } = input.url;

    for (const resource of resources) {
      if (!matchByMethod(input, resource)) continue;

      const pathMatch = matchPath(requestPath, resource.path);
      const serverMatches = [];

      const { servers = [] } = resource;
      for (const server of servers) {
        const tempServerMatch = matchBaseUrl(server, requestBaseUrl);
        if (tempServerMatch !== MatchType.NOMATCH) {
          serverMatches.push(tempServerMatch);
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
  },
};

function matchByMethod(request: IHttpRequest, operation: IHttpOperation): boolean {
  return operation.method.toLowerCase() === request.method.toLowerCase();
}

function disambiguateMatches(matches: IMatch[]): null | IHttpOperation {
  const matchResult =
    // prefer concrete server and concrete path
    matches.find(match => areServerAndPath(match, MatchType.CONCRETE, MatchType.CONCRETE)) ||
    // then prefer templated server and concrete path
    matches.find(match => areServerAndPath(match, MatchType.TEMPLATED, MatchType.CONCRETE)) ||
    // then prefer concrete server and templated path
    matches.find(match => areServerAndPath(match, MatchType.CONCRETE, MatchType.TEMPLATED)) ||
    // then fallback to first
    matches[0];
  return matchResult ? matchResult.resource : null;
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
