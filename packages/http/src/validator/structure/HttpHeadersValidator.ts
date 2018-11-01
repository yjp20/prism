import { IValidation, ValidationSeverity } from '@stoplight/prism-core';
import { IHttpHeaderParam } from '@stoplight/types/http';

import { DeserializeHttpHeader, IHttpParamDeserializerRegistry } from '../deserializer/types';
import { resolveContent } from '../helpers/resolveContent';
import { validateAgainstSchema } from '../helpers/validateAgainstSchema';
import { IHttpHeadersValidator } from './IHttpHeadersValidator';

export class HttpHeadersValidator implements IHttpHeadersValidator {
  constructor(private readonly registry: IHttpParamDeserializerRegistry<DeserializeHttpHeader>) {}

  public validate(
    headers: { [name: string]: string } = {},
    headerSpecs: IHttpHeaderParam[],
    mediaType?: string
  ): IValidation[] {
    return headerSpecs.reduce<IValidation[]>((results, spec) => {
      if (!headers.hasOwnProperty(spec.name) && spec.required === true) {
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
              deserialize(headers[spec.name], content.schema.type, spec.explode || false),
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
