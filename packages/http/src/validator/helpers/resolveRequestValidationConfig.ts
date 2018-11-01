import { IHttpConfig } from '../../types';

const DEFAULT = {
  hijack: true,
  headers: true,
  query: true,
  body: true,
};

export function resolveRequestValidationConfig(
  config?: IHttpConfig
): {
  hijack: boolean;
  headers: boolean;
  query: boolean;
  body: boolean;
} {
  if (!config || !config.validate) {
    return DEFAULT;
  }

  const request = config.validate.request;

  if (request === true) {
    return DEFAULT;
  }

  if (request === false) {
    return {
      hijack: false,
      headers: false,
      query: false,
      body: false,
    };
  }

  if (!request) {
    return DEFAULT;
  }

  return {
    hijack: request.hijack === false ? false : DEFAULT.hijack,
    headers: request.headers === false ? false : DEFAULT.headers,
    query: request.query === false ? false : DEFAULT.query,
    body: request.body === false ? false : DEFAULT.body,
  };
}
