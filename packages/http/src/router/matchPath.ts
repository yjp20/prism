import { MatchType } from './types';
import * as E from 'fp-ts/Either';
import { isEqual } from 'lodash';

const pathSeparatorsRegex = /[/:]/g;

function fragmentize(path: string): string[] {
  return path.split(pathSeparatorsRegex).slice(1);
}

// Attempt to decode path fragment. Decode should not do any harm since it is
// decoding only URI sequences which are previously created by encodeURIComponent
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
function decodePathFragment(pathFragment?: string) {
  try {
    return pathFragment && decodeURIComponent(pathFragment);
  } catch (_) {
    return pathFragment;
  }
}

function getTemplateParamName(pathFragment?: string) {
  const match = typeof pathFragment === 'string' && /{(.*)}/.exec(pathFragment);
  return match && match[1];
}

function isSeparationEqual(path1: string, path2: string): boolean {
  return isEqual(path1.match(pathSeparatorsRegex), path2.match(pathSeparatorsRegex));
}

export function matchPath(requestPath: string, operationPath: string): E.Either<Error, MatchType> {
  if (!isSeparationEqual(requestPath, operationPath)) {
    return E.right(MatchType.NOMATCH);
  }

  const operationPathFragments = fragmentize(operationPath);
  const requestPathFragments = fragmentize(requestPath);
  const params = [];
  while (requestPathFragments.length) {
    // make sure fragments are decoded before comparing them
    const requestPathFragment = decodePathFragment(requestPathFragments.shift());
    const operationPathFragment = decodePathFragment(operationPathFragments.shift());

    const paramName = getTemplateParamName(operationPathFragment);

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
