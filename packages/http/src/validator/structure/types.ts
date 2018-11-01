import { IValidation } from '@stoplight/prism-core';

export interface IHttpValidator<Obj, Specs> {
  validate(obj: Obj, specs: Specs[], mediaType?: string): IValidation[];
}
