import { IValidation } from '@stoplight/prism-core';
import { ISchema } from '@stoplight/types/schema';

export interface IHttpValidator<Target, Specs> {
  validate(target: Target, specs: Specs[], mediaType?: string): IValidation[];
}

export interface ISchemaValidator<S extends ISchema> {
  validate(content: any, schema: S): IValidation[];
  supports(mediaType: string): boolean;
}

export interface IValidatorRegistry {
  get(mediaType: string): ((content: any, schema: ISchema) => IValidation[]) | undefined;
}
