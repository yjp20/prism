import faker from '@faker-js/faker';
import { pick } from 'lodash';
import * as jsf from 'json-schema-faker';
import * as sampler from '@stoplight/json-schema-sampler';
import { Either, toError, tryCatch } from 'fp-ts/Either';
import { IHttpOperation } from '@stoplight/types';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/lib/Either';

import { JSONSchema } from '../../types';
import { stripWriteOnlyProperties } from '../../utils/filterRequiredProperties';

// necessary as workaround broken types in json-schema-faker
// @ts-ignore
jsf.extend('faker', () => faker);

// necessary as workaround broken types in json-schema-faker
// @ts-ignore
jsf.option({
  failOnInvalidTypes: false,
  failOnInvalidFormat: false,
  alwaysFakeOptionals: true,
  optionalsProbability: 1 as any,
  fixedProbabilities: true,
  ignoreMissingRefs: true,
  maxItems: 20,
  maxLength: 100,
});

export function generate(resource: unknown, source: JSONSchema): Either<Error, unknown> {
  return pipe(
    stripWriteOnlyProperties(source),
    E.fromOption(() => Error('Cannot strip writeOnly properties')),
    E.chain(updatedSource =>
      tryCatch(
        () =>
          sortSchemaAlphabetically(
            // necessary as workaround broken types in json-schema-faker
            // @ts-ignore
            jsf.generate({ ...updatedSource, ...pick(resource, ['__bundled__', 'components']) })
          ),
        toError
      )
    )
  );
}

//sort alphabetically by keys
export function sortSchemaAlphabetically(source: any): any {
  if (source && Array.isArray(source)) {
    for (const i of source) {
      if (typeof source[i] === 'object') {
        source[i] = sortSchemaAlphabetically(source[i]);
      }
    }
    return source;
  } else if (source && typeof source === 'object') {
    Object.keys(source).forEach((key: string) => {
      if (typeof source[key] === 'object') {
        source[key] = sortSchemaAlphabetically(source[key]);
      }
    });
    return Object.fromEntries(Object.entries(source).sort());
  }

  //just return if not array or object
  return source;
}

export function generateStatic(resource: IHttpOperation, source: JSONSchema): Either<Error, unknown> {
  return tryCatch(() => sampler.sample(source, {}, resource), toError);
}
