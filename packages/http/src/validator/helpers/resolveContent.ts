import { IHttpContent } from '@stoplight/types/http';

export function resolveContent(content: { [mediaType: string]: IHttpContent }, mediaType?: string) {
  return content[mediaType || '*'] || content['*'];
}
