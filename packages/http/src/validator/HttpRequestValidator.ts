import { IHttpOperation } from '@stoplight/types/http';
import { IHttpRequest } from '../types';
import IHttpRequestValidationResult from './IHttpRequestValidationResult';

export default class HttpRequestValidator {
  public validate(
    httpOperation: IHttpOperation,
    httpRequest: IHttpRequest
  ): IHttpRequestValidationResult {
    throw new Error('Not implemented yet');
  }
}
