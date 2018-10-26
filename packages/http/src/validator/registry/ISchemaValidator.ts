import { IValidation } from '@stoplight/prism-core';
import { ISchema } from '@stoplight/types/schema';

export interface ISchemaValidator<S extends ISchema> {
  validate(content: any, schema: S): IValidation[];
  supports(mediaType: string): boolean;
}
