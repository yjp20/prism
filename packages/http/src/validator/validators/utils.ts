import { IValidation, ValidationSeverity } from '@stoplight/prism-core';
import { ISchema } from '@stoplight/types';
import { ErrorObject } from 'ajv';
// @ts-ignore
import * as AjvOAI from 'ajv-oai';

const ajv = new AjvOAI({ allErrors: true, messages: true });

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
  prefix?: string
): IValidation[] => {
  try {
    const validate = ajv.compile(schema);
    const valid = validate(value);
    let errors: IValidation[] = [];
    if (!valid) {
      errors = convertAjvErrors(validate.errors, ValidationSeverity.ERROR).map(error => {
        const path = prefix ? [prefix, ...error.path] : [...error.path];
        return Object.assign({}, error, { path });
      });
    }
    return errors;
  } catch (error) {
    throw new Error(`AJV validation error: "${error}"`);
  }
};
