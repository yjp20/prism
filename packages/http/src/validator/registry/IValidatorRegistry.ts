import { IValidation } from '@stoplight/prism-core';
import { ISchema } from '@stoplight/types/schema';

export interface IValidatorRegistry {
  get(mediaType: string): ((content: any, schema: ISchema) => IValidation[]) | undefined;
}
