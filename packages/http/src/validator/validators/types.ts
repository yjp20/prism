import { IPrismDiagnostic } from '@stoplight/prism-core';
import { JSONSchema } from '../../';
import { Either } from 'fp-ts/Either';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';

export interface IHttpValidator<Target, Specs> {
  validate(target: Target, specs: Specs[], mediaType?: string): Either<NonEmptyArray<IPrismDiagnostic>, Target>;
}

export interface ISchemaValidator<S = JSONSchema> {
  validate(content: unknown, schema: S): IPrismDiagnostic[];
  supports(mediaType: string): boolean;
}
