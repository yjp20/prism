import * as faker from 'faker/locale/en_US';
import { JSONSchema } from '../../types';

import * as jsf from 'json-schema-faker';
import * as sampler from 'openapi-sampler';
import { Either, tryCatch, toError, right } from 'fp-ts/Either';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/pipeable';
import { stripWriteOnly } from 'http/src/utils/jsonSchema';

jsf.extend('faker', () => faker);

jsf.option({
  failOnInvalidTypes: false,
  failOnInvalidFormat: false,
  alwaysFakeOptionals: true,
  optionalsProbability: 1,
  fixedProbabilities: true,
  ignoreMissingRefs: true,
  maxItems: 20,
  maxLength: 100,
});

export function generate(source: JSONSchema): Either<Error, unknown> {
  return pipe(
    stripWriteOnly(source),
    O.fold(
      () => right(undefined),
      schema => tryCatch(() => jsf.generate(schema), toError)
    )
  );
}

export function generateStatic(resource: unknown, source: JSONSchema): Either<Error, unknown> {
  return tryCatch(() => sampler.sample(source, {}, resource), toError);
}
