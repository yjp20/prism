import { ValidationSeverity } from '@stoplight/prism-core/types';
import { ErrorObject } from 'ajv';

export function convertAjvErrors(
  errors: ErrorObject[],
  pathPrefix: string,
  severity: ValidationSeverity
) {
  return errors.map(error => ({
    path: [pathPrefix, ...error.dataPath.split('.').slice(1)],
    name: error.keyword || '',
    summary: error.message || '',
    message: error.message || '',
    severity,
  }));
}
