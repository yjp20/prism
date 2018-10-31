export function getMediaTypeFromHeaders(headers: { [key: string]: string }): string | undefined {
  const contentTypeKey = Object.keys(headers).find(name => name.toLowerCase() === 'content-type');
  return contentTypeKey && headers[contentTypeKey];
}
