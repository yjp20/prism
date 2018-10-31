import { IValidation } from '@stoplight/prism-core';
import { IHttpHeaderParam } from '@stoplight/types/http';

export interface IHttpHeadersValidator {
  validate(
    headers: { [name: string]: string },
    headerSpecs: IHttpHeaderParam[],
    mediaType?: string
  ): IValidation[];
}
