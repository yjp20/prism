import { IServer } from "@stoplight/types/server";
import { INodeVariable } from "@stoplight/types/node";
import { IServerMatch, Nullable } from "./types";

const variableRegexp = /{(.*?)}/g;

export function matchServer(server: IServer, requestUrl: URL): Nullable<IServerMatch> {
  const templateMatchResult = matchRequestUrlToTemplateUrl(
    requestUrl.href,
    server.url,
    server.variables
  );

  if (!templateMatchResult) {
    return null;
  }

  const [matchedRequestUrlPortion] = Array.from(templateMatchResult);

  const path = (requestUrl.origin + requestUrl.pathname).substring(matchedRequestUrlPortion.length);
  return {
    baseUrl: matchedRequestUrlPortion,
    path
  }
}

export function convertTemplateToRegExp(urlTemplate: string, variables?: { [name: string]: INodeVariable; }) {
  if (!variables) {
    return new RegExp(urlTemplate);
  }

  return new RegExp(urlTemplate.replace(variableRegexp, (match, variableName) => {
    const variable = variables[variableName];
    if (!variable) {
      throw new Error(`Variable '${variableName}' is not defined, cannot parse input.`);
    }
    let { enum: enums } = variable;
    if (enums) {
      enums = enums.sort((a, b) => b.length - a.length);
    }
    return `(${(enums && enums.length) ? enums.join('|') : '.*?'})`;
  }));
}

function matchRequestUrlToTemplateUrl(requestUrl: string, templateUrl: string, variables?: any) {
  const regexp = convertTemplateToRegExp(templateUrl, variables);
  return requestUrl.match(regexp);
}
