import { IHttpOperationResponse as IHttpResponseSpec } from '@stoplight/types/http-spec';

export function findResponseSpec(
  responseSpecs: IHttpResponseSpec[],
  statusCode: number
): IHttpResponseSpec | undefined {
  const sortedSpecs = responseSpecs
    .filter(spec => new RegExp(`^${spec.code.replace(/X/g, '\\d')}$`).test(String(statusCode)))
    .sort((s1, s2) => s1.code.split('X').length - s2.code.split('X').length);

  return sortedSpecs[0];
}
