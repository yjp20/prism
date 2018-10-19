import { IHttpConfig, IHttpRequest } from '@stoplight/prism-http/types';

export async function getHttpConfigFromRequest(req: IHttpRequest): Promise<IHttpConfig> {
  const config: any = {};

  if (req.url.query!.__code) {
    config.code = req.url.query!.__code;
  }

  if (req.url.query!.__dynamic) {
    config.dynamic = req.url.query!.__dynamic.toLowerCase() === 'true';
  }

  if (req.url.query!.__contentType) {
    config.mediaType = req.url.query!.__contentType;
  }

  if (req.url.query!.__example) {
    config.exampleKey = req.url.query!.__example;
  }

  return config;
}
