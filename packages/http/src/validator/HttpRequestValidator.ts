import IHttpRequestValidationResult from "./IHttpRequestValidationResult";
import { IHttpRequest } from "../types";
import { IHttpOperation } from "@stoplight/types/http";

export default class HttpRequestValidator {
  public validate(httpOperation: IHttpOperation, httpRequest: IHttpRequest): IHttpRequestValidationResult {
    throw new Error('Not implemented yet');
  }
}
