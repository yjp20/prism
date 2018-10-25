import { ISchemaValidator } from '@stoplight/prism-http/validator/registry/ISchemaValidator';
import { ISchema } from '@stoplight/types/schema';

export class ValidatorRegistry {
  constructor(private validators: Array<ISchemaValidator<ISchema>>) {}

  public get(mediaType: string) {
    const validator = this.validators.find(v => v.supports(mediaType));

    if (!validator) {
      return;
    }

    return (content: any, schema: ISchema) => validator.validate(content, schema);
  }
}
