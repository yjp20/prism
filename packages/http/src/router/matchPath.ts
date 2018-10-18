import { MatchType } from './types';

function fragmentarize(path: string): string[] {
  return path.split('/').slice(1);
}

function getTemplateParamName(pathFragment: string) {
  const match = pathFragment.match(/^{(.*)}$/);
  return match && match[1];
}

/**
 * @returns `true` if matched concrete, `false` if not matched, `path param values` if matched templated
 */
export function matchPath(requestPath: string, operationPath: string): MatchType {
  if (!requestPath.startsWith('/')) {
    throw new Error('The request path must start with a slash.');
  }
  if (!operationPath.startsWith('/')) {
    throw new Error('The operation path must start with a slash.');
  }
  const operationPathFragments = fragmentarize(operationPath);
  const requestPathFragments = fragmentarize(requestPath);

  if (
    operationPathFragments.length < requestPathFragments.length ||
    operationPathFragments.length > requestPathFragments.length
  ) {
    return MatchType.NOMATCH;
  }

  const params = [];
  while (requestPathFragments.length) {
    const requestPathFragment = requestPathFragments.shift();
    const operationPathFragment = operationPathFragments.shift();

    const paramName = getTemplateParamName(operationPathFragment as string);

    if (paramName === null && operationPathFragment !== requestPathFragment) {
      // if concrete fragment and fragments are different return false
      return MatchType.NOMATCH;
    } else if (paramName !== null) {
      params.push({
        name: paramName as string,
        value: requestPathFragment as string,
      });
    }
  }

  return params.length ? MatchType.TEMPLATED : MatchType.CONCRETE;
}
