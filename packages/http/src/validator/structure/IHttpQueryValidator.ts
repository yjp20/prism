import { IValidation } from '@stoplight/prism-core';
import { IHttpQueryParam } from '@stoplight/types/http';

export interface IHttpQueryValidator {
  validate(
    query: {
      [name: string]: string | string[];
    },
    querySpecs: IHttpQueryParam[],
    mediaType?: string
  ): IValidation[];
}
