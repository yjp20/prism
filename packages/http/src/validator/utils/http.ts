import { IHttpContent } from '@stoplight/types/http-spec';

import { IHttpNameValue } from '../../types';

export function getHeaderByName(headers: IHttpNameValue, name: string): string | undefined {
  const key = Object.keys(headers).find(n => n.toLowerCase() === name.toLowerCase());
  if (!key) return;

  return headers[key];
}

export function resolveContent(content: { [mediaType: string]: IHttpContent }, mediaType?: string) {
  return content[mediaType || '*'] || content['*'];
}
