export function getHeaderByName(
  headers: { [key: string]: string },
  name: string
): string | undefined {
  const contentTypeKey = Object.keys(headers).find(n => n.toLowerCase() === name.toLowerCase());
  return contentTypeKey && headers[contentTypeKey];
}
