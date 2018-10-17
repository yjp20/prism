import { IPathMatch } from "./types";

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
export function matchPath(requestPath: string, operation: { path: string }): IPathMatch {
  const operationPath = operation.path;
  if (!requestPath.startsWith('/')) {
    throw new Error('The request path must start with a slash.');
  }
  if (!operationPath.startsWith('/')) {
    throw new Error('The operation path must start with a slash.');
  }
  const operationPathFragments = fragmentarize(operationPath);
  const requestPathFragments = fragmentarize(requestPath);

  if (operationPathFragments.length < requestPathFragments.length
    || operationPathFragments.length > requestPathFragments.length) {
    return false;
  }

  const params = [];
  while (requestPathFragments.length) {
    const requestPathFragment = requestPathFragments.shift();
    const operationPathFragment = operationPathFragments.shift();

    const paramName = getTemplateParamName(operationPathFragment as string);

    if (paramName === null && operationPathFragment !== requestPathFragment) {
      // if concrete fragment and fragments are different return false
      return false;
    } else if (paramName !== null) {
      params.push({
        name: paramName as string,
        value: requestPathFragment as string,
      });
    }
  }

  return params;
}
