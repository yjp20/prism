import { ValidatorRegistry } from './registry';
import { JSONSchemaValidator } from './schema';

export { HttpBodyValidator } from './body';
export { HttpHeadersValidator } from './headers';
export { HttpQueryValidator } from './query';
export { IHttpValidator } from './types';

export const validatorRegistry = new ValidatorRegistry([new JSONSchemaValidator()]);
