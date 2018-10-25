import { JSONSchemaValidator } from '@stoplight/prism-http/validator/registry/JSONSchemaValidator';
import { ValidatorRegistry } from '@stoplight/prism-http/validator/registry/ValidatorRegistry';

export const validatorRegistry = new ValidatorRegistry([new JSONSchemaValidator()]);
