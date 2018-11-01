import { IValidation } from '@stoplight/prism-core';
import { ISchema } from '@stoplight/types/schema';

import { ISchemaValidator } from './ISchemaValidator';
import { IValidatorRegistry } from './IValidatorRegistry';

export class ValidatorRegistry implements IValidatorRegistry {
  constructor(private validators: Array<ISchemaValidator<ISchema>>) {}

  public get(mediaType: string): ((content: any, schema: ISchema) => IValidation[]) | undefined {
    const validator = this.validators.find(v => v.supports(mediaType));

    if (!validator) {
      return;
    }

    return validator.validate.bind(validator);
  }
}
