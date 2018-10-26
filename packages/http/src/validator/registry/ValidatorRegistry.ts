import { IValidation } from '@stoplight/prism-core';
import { ISchemaValidator } from '@stoplight/prism-http/validator/registry/ISchemaValidator';
import { IValidatorRegistry } from '@stoplight/prism-http/validator/registry/IValidatorRegistry';
import { ISchema } from '@stoplight/types/schema';

export class ValidatorRegistry implements IValidatorRegistry {
  constructor(private validators: Array<ISchemaValidator<ISchema>>) {}

  public get(mediaType: string): ((content: any, schema: ISchema) => IValidation[]) | undefined {
    const validator = this.validators.find(v => v.supports(mediaType));

    if (!validator) {
      return;
    }

    return (content: any, schema: ISchema) => validator.validate(content, schema);
  }
}
