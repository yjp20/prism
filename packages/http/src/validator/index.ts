import { HttpRequestBodyValidator } from './helpers/HttpRequestBodyValidator';
import { HttpValidator } from './HttpValidator';
import { validatorRegistry } from './registry';

export const validator = new HttpValidator(new HttpRequestBodyValidator(validatorRegistry));
