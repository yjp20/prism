import { JSONSchemaValidator } from './JSONSchemaValidator';
import { ValidatorRegistry } from './ValidatorRegistry';

export const validatorRegistry = new ValidatorRegistry([new JSONSchemaValidator()]);
