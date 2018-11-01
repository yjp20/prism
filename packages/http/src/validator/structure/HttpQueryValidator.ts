import { IValidation, ValidationSeverity } from '@stoplight/prism-core';
import { IHttpQueryParam } from '@stoplight/types/http';

import { IHttpNameValues } from '../../types';
import { DeserializeHttpQuery, IHttpParamDeserializerRegistry } from '../deserializer/types';
import { resolveContent } from '../helpers/http';
import { validateAgainstSchema } from '../helpers/validate';
import { IHttpValidator } from './types';

export class HttpQueryValidator implements IHttpValidator<IHttpNameValues, IHttpQueryParam> {
  constructor(private readonly registry: IHttpParamDeserializerRegistry<DeserializeHttpQuery>) {}

  public validate(
    obj: IHttpNameValues,
    specs: IHttpQueryParam[],
    mediaType?: string
  ): IValidation[] {
    return specs.reduce<IValidation[]>((results, spec) => {
      if (!obj.hasOwnProperty(spec.name) && spec.required === true) {
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
              deserialize(spec.name, obj, content.schema, spec.explode || false),
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
