import { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/pipeable';
import { mapValues, intersection } from 'lodash/fp';

type RequiredSchemaSubset = {
  readOnly?: boolean;
  properties?: Record<string, JSONSchema6 | JSONSchema7 | JSONSchema4 | boolean>;
  required?: string[] | false;
};

export function stripReadOnly<S extends RequiredSchemaSubset>(inputSchema: S): O.Option<S> {
  if (inputSchema.readOnly) {
    return O.none;
  }

  const strippedProperties = pipe(
    O.fromNullable(inputSchema.properties),
    O.map(
      mapValues(val => {
        return pipe(
          O.some(val),
          O.chain(val => (typeof val === 'boolean' ? O.none : stripReadOnly(val))),
          O.toUndefined
        );
      })
    )
  );

  const strippedPropertyKeys = pipe(
    strippedProperties,
    O.map(Object.keys),
    O.getOrElse(() => [] as string[])
  );

  const requiredPropertyKeys = pipe(
    O.fromNullable(inputSchema.required || null),
    O.map(intersection(strippedPropertyKeys)),
    O.toUndefined
  );

  return O.some({
    ...inputSchema,
    properties: O.toUndefined(strippedProperties),
    required: requiredPropertyKeys,
  });
}
