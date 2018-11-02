import { IValidation } from '@stoplight/prism-core';
import { HttpParamStyles } from '@stoplight/types/http.d';
import { ISchema } from '@stoplight/types/schema';

export interface IHttpValidator<Target, Registry, Specs> {
  validate(
    target: Target,
    specs: Specs[],
    registry: Registry,
    prefix: string,
    mediaType?: string,
    style?: HttpParamStyles
  ): IValidation[];
}

export interface ISchemaValidator<S extends ISchema> {
  validate(content: any, schema: S): IValidation[];
  supports(mediaType: string): boolean;
}

export interface IValidatorRegistry {
  get(mediaType: string): ((content: any, schema: ISchema) => IValidation[]) | undefined;
}
