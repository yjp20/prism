import { IHttpOperationConfig } from '@stoplight/prism-http/types';
import { Request } from 'express';

export function getHttpOperationConfigFromRequest(req: Request): IHttpOperationConfig {
  const config: any = {};

  if (req.query.__code) {
    config.code = req.query.__code;
  }

  return config;
}
