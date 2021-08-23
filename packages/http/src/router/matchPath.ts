import { MatchType } from './types';
import * as E from 'fp-ts/Either';
import { isEqual } from 'lodash';

const pathSeparatorsRegex = /[/:]/g;

function fragmentarize(path: string): string[] {
  return path.split(pathSeparatorsRegex).slice(1);
}

function getTemplateParamName(pathFragment: string) {
  const match = /{(.*)}/.exec(pathFragment);
  return match && match[1];
}

function isSeparationEqual(path1: string, path2: string): boolean {
  return isEqual(path1.match(pathSeparatorsRegex), path2.match(pathSeparatorsRegex));
}

export function matchPath(requestPath: string, operationPath: string): E.Either<Error, MatchType> {
  if (!isSeparationEqual(requestPath, operationPath)) {
    return E.right(MatchType.NOMATCH);
  }

  const operationPathFragments = fragmentarize(operationPath);
  const requestPathFragments = fragmentarize(requestPath);
  const params = [];
  while (requestPathFragments.length) {
    const requestPathFragment = requestPathFragments.shift();
    const operationPathFragment = operationPathFragments.shift();

    const paramName = getTemplateParamName(operationPathFragment as string);

    if (paramName === null && operationPathFragment !== requestPathFragment) {
      // if concrete fragment and fragments are different return false
      return E.right(MatchType.NOMATCH);
    } else if (paramName !== null) {
      params.push({
        name: paramName,
        value: requestPathFragment,
      });
    }
  }

  return E.right(params.length ? MatchType.TEMPLATED : MatchType.CONCRETE);
}
