import { IHttpOperationConfig } from '@stoplight/prism-http/types';
import { Request } from 'express';

export const getHttpOperationConfigFromRequest = (req: Request): IHttpOperationConfig => {
  const config: IHttpOperationConfig = {};

  if (req.query.__code) {
    config.code = req.query.__code;
  }

  return config;
};
