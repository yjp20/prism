import { IValidation } from '@stoplight/prism-core';
import { ISchema } from '@stoplight/types';

import { ISchemaValidator } from './types';
import { validateAgainstSchema } from './utils';

const SUPPORTED_MEDIATYPES = ['application/json'];

export class JSONSchemaValidator implements ISchemaValidator<ISchema> {
  public validate(content: any, schema: ISchema): IValidation[] {
    return validateAgainstSchema(JSON.parse(content), schema);
  }

  public supports(mediaType: string) {
    return SUPPORTED_MEDIATYPES.indexOf(mediaType) > -1;
  }
}
