import { IValidation } from '@stoplight/prism-core';
import { ValidationSeverity } from '@stoplight/prism-core/types';
import { IHttpQueryParam } from '@stoplight/types/http';

import { DeserializeHttpQuery, IHttpParamDeserializerRegistry } from '../deserializer/types';
import { resolveContent } from '../helpers/resolveContent';
import { validateAgainstSchema } from '../helpers/validateAgainstSchema';
import { IHttpQueryValidator } from './IHttpQueryValidator';

export class HttpQueryValidator implements IHttpQueryValidator {
  constructor(private readonly registry: IHttpParamDeserializerRegistry<DeserializeHttpQuery>) {}

  public validate(
    query: {
      [name: string]: string | string[];
    },
    querySpecs: IHttpQueryParam[],
    mediaType?: string
  ): IValidation[] {
    return querySpecs.reduce<IValidation[]>((results, spec) => {
      if (!query.hasOwnProperty(spec.name) && spec.required === true) {
        results.push({
          path: ['query', spec.name],
          name: 'required',
          summary: '',
          message: `Missing ${spec.name} query param`,
          severity: ValidationSeverity.ERROR,
        });

        // stop further checks
        return results;
      }

      const content = resolveContent(spec.content, mediaType);

      if (content && content.schema) {
        const deserialize = this.registry.get(spec.style || 'form');

        if (deserialize) {
          Array.prototype.push.apply(
            results,
            validateAgainstSchema(
              deserialize(spec.name, query, content.schema, spec.explode || false),
              content.schema,
              'query'
            )
          );
        }
      }

      if (spec.deprecated === true) {
        results.push({
          path: ['query', spec.name],
          name: 'deprecated',
          summary: '',
          message: `Query param ${spec.name} is deprecated`,
          severity: ValidationSeverity.WARN,
        });
      }

      return results;
    }, []);
  }
}
