import { IRouter } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';

import { IHttpConfig, IHttpRequest } from '../types';
import {
  NO_RESOURCE_PROVIDED_ERROR,
  NO_SERVER_CONFIGURATION_PROVIDED_ERROR,
  NONE_METHOD_MATCHED_ERROR,
  NONE_PATH_MATCHED_ERROR,
  NONE_SERVER_MATCHED_ERROR,
  ROUTE_DISAMBIGUATION_ERROR,
} from './errors';
import { matchBaseUrl } from './matchBaseUrl';
import { matchPath } from './matchPath';
import { IMatch, MatchType } from './types';

export const router: IRouter<IHttpOperation, IHttpRequest, IHttpConfig> = {
  route: async ({ resources, input }) => {
    const matches = [];
    const { path: requestPath, baseUrl: requestBaseUrl } = input.url;

    if (!resources.length) {
      throw NO_RESOURCE_PROVIDED_ERROR;
    }

    let noServerProvided: boolean = true;
    let noneMethodMatched: boolean = true;
    let nonePathMatched: boolean = true;
    let noneServerMatched: boolean = true;

    for (const resource of resources) {
      if (!matchByMethod(input, resource)) continue;
      noneMethodMatched = false;

      const pathMatch = matchPath(requestPath, resource.path);
      const serverMatches = [];

      const { servers = [] } = resource;

      if (servers.length) noServerProvided = false;
      if (pathMatch !== MatchType.NOMATCH) nonePathMatched = false;

      for (const server of servers) {
        const tempServerMatch = matchBaseUrl(server, requestBaseUrl);
        if (tempServerMatch !== MatchType.NOMATCH) {
          serverMatches.push(tempServerMatch);
        }
      }

      const serverMatch = disambiguateServers(serverMatches);

      if (serverMatch) {
        noneServerMatched = false;
        if (pathMatch !== MatchType.NOMATCH) {
          matches.push({
            pathMatch,
            serverMatch,
            resource,
          });
        }
      }
    }

    if (noneMethodMatched) {
      throw NONE_METHOD_MATCHED_ERROR;
    }

    if (noServerProvided) {
      throw NO_SERVER_CONFIGURATION_PROVIDED_ERROR;
    }

    if (nonePathMatched) {
      throw NONE_PATH_MATCHED_ERROR;
    }

    if (noneServerMatched) {
      throw NONE_SERVER_MATCHED_ERROR;
    }

    return disambiguateMatches(matches);
  },
};

function matchByMethod(request: IHttpRequest, operation: IHttpOperation): boolean {
  return operation.method.toLowerCase() === request.method.toLowerCase();
}

function disambiguateMatches(matches: IMatch[]): IHttpOperation {
  const matchResult =
    // prefer concrete server and concrete path
    matches.find(match => areServerAndPath(match, MatchType.CONCRETE, MatchType.CONCRETE)) ||
    // then prefer templated server and concrete path
    matches.find(match => areServerAndPath(match, MatchType.TEMPLATED, MatchType.CONCRETE)) ||
    // then prefer concrete server and templated path
    matches.find(match => areServerAndPath(match, MatchType.CONCRETE, MatchType.TEMPLATED)) ||
    // then fallback to first
    matches[0];

  if (!matchResult) {
    throw ROUTE_DISAMBIGUATION_ERROR;
  }

  return matchResult.resource;
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
