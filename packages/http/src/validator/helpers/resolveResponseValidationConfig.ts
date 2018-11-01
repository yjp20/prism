import { IHttpConfig } from '../../types';

const DEFAULT = {
  headers: true,
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
