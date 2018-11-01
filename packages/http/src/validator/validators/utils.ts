import { IValidation, ValidationSeverity } from '@stoplight/prism-core';
import { ISchema } from '@stoplight/types/schema';
import * as Ajv from 'ajv';
import { ErrorObject } from 'ajv';

const ajv = new Ajv({ allErrors: true, messages: true });

export const convertAjvErrors = (
  errors: ErrorObject[] | undefined | null,
  severity: ValidationSeverity
) => {
  if (!errors) {
    return [];
  }

  return errors.map(error => ({
    path: error.dataPath.split('.').slice(1),
    name: error.keyword || '',
    summary: error.message || '',
    message: error.message || '',
    severity,
  }));
};

export const validateAgainstSchema = (
  value: any,
  schema: ISchema,
  prefix: string
): IValidation[] => {
  const validate = ajv.compile(schema);
  const valid = validate(value);
  let errors: IValidation[] = [];
  if (!valid) {
    errors = convertAjvErrors(validate.errors, ValidationSeverity.ERROR).map(error =>
      Object.assign({}, error, { path: [prefix, ...error.path] })
    );
  }

  return errors;
};
