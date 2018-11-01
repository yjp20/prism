import { IValidation, ValidationSeverity } from '@stoplight/prism-core';
import { IHttpHeaderParam } from '@stoplight/types/http';

import { IHttpNameValue } from '../../types';
import { DeserializeHttpHeader, IHttpParamDeserializerRegistry } from '../deserializer/types';
import { resolveContent } from '../helpers/http';
import { validateAgainstSchema } from '../helpers/validate';
import { IHttpValidator } from './types';

export class HttpHeadersValidator implements IHttpValidator<IHttpNameValue, IHttpHeaderParam> {
  constructor(private readonly registry: IHttpParamDeserializerRegistry<DeserializeHttpHeader>) {}

  public validate(
    obj: IHttpNameValue = {},
    specs: IHttpHeaderParam[],
    mediaType?: string
  ): IValidation[] {
    return specs.reduce<IValidation[]>((results, spec) => {
      if (!obj.hasOwnProperty(spec.name) && spec.required === true) {
        results.push({
          path: ['header', spec.name],
          name: 'required',
          summary: '',
          message: `Missing ${spec.name} header param`,
          severity: ValidationSeverity.ERROR,
        });

        // stop further checks
        return results;
      }

      const content = resolveContent(spec.content, mediaType);

      if (content && content.schema) {
        const deserialize = this.registry.get(spec.style || 'simple');

        if (deserialize) {
          Array.prototype.push.apply(
            results,
            validateAgainstSchema(
              deserialize(obj[spec.name], content.schema.type, spec.explode || false),
              content.schema,
              'header'
            )
          );
        }
      }

      if (spec.deprecated === true) {
        results.push({
          path: ['header', spec.name],
          name: 'deprecated',
          summary: '',
          message: `Header param ${spec.name} is deprecated`,
          severity: ValidationSeverity.WARN,
        });
      }

      return results;
    }, []);
  }
}
