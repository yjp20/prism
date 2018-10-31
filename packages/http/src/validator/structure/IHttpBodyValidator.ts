import { IValidation } from '@stoplight/prism-core';
import { IHttpContent } from '@stoplight/types/http';

export interface IHttpBodyValidator {
  validate(body: any, contentSpecs: IHttpContent[], mediaType?: string): IValidation[];
}
