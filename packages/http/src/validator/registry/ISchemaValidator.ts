import { IValidation } from '@stoplight/prism-core';

export interface ISchemaValidator<S> {
  validate(content: any, schema: S): IValidation[];
  supports(mediaType: string): boolean;
}
