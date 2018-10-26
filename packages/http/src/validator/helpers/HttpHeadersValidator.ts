import { IValidation } from '@stoplight/prism-core';
import { ValidationSeverity } from '@stoplight/prism-core/types';
import { HttpParamDeserializerRegistry } from '@stoplight/prism-http/validator/deserializer/HttpParamDeserializerRegistry';
import {
  DeserializeHttpHeader,
  IHttpHeaderParamStyleDeserializer,
} from '@stoplight/prism-http/validator/deserializer/IHttpHeaderParamStyleDeserializer';
import { convertAjvErrors } from '@stoplight/prism-http/validator/helpers/convertAjvErrors';
import { IHttpContent, IHttpRequest } from '@stoplight/types/http';
import * as Ajv from 'ajv';
import { Ajv as AjvClass } from 'ajv';

export class HttpHeadersValidator {
  private ajv: AjvClass;

  constructor(
    private readonly registry: HttpParamDeserializerRegistry<
      IHttpHeaderParamStyleDeserializer,
      DeserializeHttpHeader
    >
  ) {
    this.ajv = new Ajv({ allErrors: true, messages: true });
  }

  public validate(
    headers: { [name: string]: string } = {},
    requestSpec?: IHttpRequest,
    mediaType?: string
  ) {
    if (!requestSpec) {
      return [];
    }

    if (!requestSpec.headers) {
      return [];
    }

    return requestSpec.headers.reduce<IValidation[]>((results, spec) => {
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

      const content = this.resolveContent(spec.content, mediaType);

      if (content && content.schema) {
        const deserialize = this.registry.get(spec.style || 'simple');

        if (deserialize) {
          Array.prototype.push.apply(
            results,
            this.validateAgainstSchema(
              deserialize(headers[spec.name], content.schema.type, spec.explode || false),
              content.schema
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

  private validateAgainstSchema(value: string, schema: any): IValidation[] {
    const validate = this.ajv.compile(schema);

    if (!validate(value)) {
      return convertAjvErrors(validate.errors, ValidationSeverity.ERROR).map(error =>
        Object.assign({}, error, { path: ['header', ...error.path] })
      );
    }

    return [];
  }

  private resolveContent(content: { [mediaType: string]: IHttpContent }, mediaType?: string) {
    if (!mediaType) {
      if (content.hasOwnProperty('*')) {
        return content['*'];
      }

      return null;
    }

    if (content.hasOwnProperty(mediaType)) {
      return content[mediaType];
    }

    return content['*'];
  }
}
