import { IValidation, ValidationSeverity } from '@stoplight/prism-core';
import { ISchema } from '@stoplight/types/schema';
import * as Ajv from 'ajv';
import { Ajv as AjvClass } from 'ajv';

import { convertAjvErrors } from '../helpers/validate';
import { ISchemaValidator } from './types';

const SUPPORTED_MEDIATYPES = ['application/json'];

// TODO: Should this be in the structure folder? It looks like that is where the validation logic is.
export class JSONSchemaValidator implements ISchemaValidator<ISchema> {
  private ajv: AjvClass;

  constructor() {
    this.ajv = new Ajv({ allErrors: true, messages: true });
  }

  public validate(content: any, schema: ISchema): IValidation[] {
    const validate = this.ajv.compile(schema);
    const errors = validate(JSON.parse(content)) ? [] : validate.errors;
    return convertAjvErrors(errors, ValidationSeverity.ERROR);
  }

  public supports(mediaType: string) {
    return SUPPORTED_MEDIATYPES.indexOf(mediaType) > -1;
  }
}
