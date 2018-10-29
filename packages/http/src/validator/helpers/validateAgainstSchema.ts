import { IValidation } from '@stoplight/prism-core';
import { ValidationSeverity } from '@stoplight/prism-core/types';
import { convertAjvErrors } from '@stoplight/prism-http/validator/helpers/convertAjvErrors';
import { ISchema } from '@stoplight/types/schema';
import * as Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, messages: true });

export function validateAgainstSchema(value: any, schema: ISchema, prefix: string): IValidation[] {
  const validate = ajv.compile(schema);

  if (!validate(value)) {
    return convertAjvErrors(validate.errors, ValidationSeverity.ERROR).map(error =>
      Object.assign({}, error, { path: [prefix, ...error.path] })
    );
  }

  return [];
}
