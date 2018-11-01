import { IHttpConfig } from '../../types';

const DEFAULT = {
  hijack: false,
  headers: true,
  query: true,
  body: true,
};

export function resolveResponseValidationConfig(
  config?: IHttpConfig
): {
  headers: boolean;
  body: boolean;
} {
  if (!config || !config.validate) {
    return DEFAULT;
  }

  const response = config.validate.response;

  if (response === true) {
    return DEFAULT;
  }

  if (response === false) {
    return {
      headers: false,
      body: false,
    };
  }

  if (!response) {
    return DEFAULT;
  }

  return {
    headers: response.headers === false ? false : DEFAULT.headers,
    body: response.body === false ? false : DEFAULT.body,
  };
}

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
