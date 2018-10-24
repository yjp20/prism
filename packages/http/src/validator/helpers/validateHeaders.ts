import { IValidation } from '@stoplight/prism-core';
import { ValidationSeverity } from '@stoplight/prism-core/types';
import { IHttpContent, IHttpHeaderParam } from '@stoplight/types/http';
import * as Ajv from 'ajv';
import { convertAjvErrors } from './convertAjvErrors';

const ajv = new Ajv({ allErrors: true, messages: true });

export function validateHeaders(
  headers: { [name: string]: string } = {},
  specs: IHttpHeaderParam[] = [],
  mediaType?: string
): IValidation[] {
  return specs.reduce<IValidation[]>((results, spec) => {
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
      if (spec.explode === true) {
        Array.prototype.push.apply(
          results,
          explodeAndValidateAgainstSchema(headers, content.schema)
        );
      } else {
        Array.prototype.push.apply(
          results,
          validateAgainstSchema(headers[spec.name], content.schema)
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

function explodeAndValidateAgainstSchema(headers: { [name: string]: string }, schema: any) {
  if (schema.type !== 'object') {
    throw new Error('Explode can be only applied to header of object type');
  }

  const schemaProperties = schema.properties || {};

  const validationSubject = Object.keys(schemaProperties).reduce(
    (subject, key) => ({ ...subject, [key]: headers[key] }),
    {}
  );

  const validate = ajv.compile(schema);
  if (!validate(validationSubject)) {
    return convertAjvErrors(validate.errors, 'header', ValidationSeverity.ERROR);
  }

  return [];
}

function validateAgainstSchema(value: string, schema: any): IValidation[] {
  const validate = ajv.compile(schema);

  if (!validate(value)) {
    return convertAjvErrors(validate.errors, 'header', ValidationSeverity.ERROR);
  }

  return [];
}

function resolveContent(content: { [mediaType: string]: IHttpContent }, mediaType?: string) {
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
