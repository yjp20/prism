import { IValidation, ValidationSeverity } from '@stoplight/prism-core';
import { ISchema } from '@stoplight/types';
import * as Ajv from 'ajv';
import { Ajv as AjvClass } from 'ajv';

import { ISchemaValidator } from './types';
import { convertAjvErrors } from './utils';

const SUPPORTED_MEDIATYPES = ['application/json'];

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
