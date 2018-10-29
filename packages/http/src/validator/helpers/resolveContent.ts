import { IHttpContent } from '@stoplight/types/http';

export function resolveContent(content: { [mediaType: string]: IHttpContent }, mediaType?: string) {
  if (!mediaType) {
    if (content.hasOwnProperty('*')) {
      return content['*'];
    }

    return null;
  }

  if (content.hasOwnProperty(mediaType)) {
    return content[mediaType];
  }

  return content['*'];
}
