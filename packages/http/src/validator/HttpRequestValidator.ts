import { IHttpOperation } from '@stoplight/types/http';

import { IHttpRequest } from '../types';
import IHttpRequestValidationResult from './IHttpRequestValidationResult';

export default class HttpRequestValidator {
  public validate(
    _httpOperation: IHttpOperation,
    _httpRequest: IHttpRequest
  ): IHttpRequestValidationResult {
    throw new Error('Not implemented yet');
  }
}
