import { HttpParamStyles, IHttpQueryParam } from '@stoplight/types';

import { IValidation } from '@stoplight/prism-core';
import { IHttpNameValues } from '../../types';
import { IHttpParamDeserializerRegistry } from '../deserializers/types';
import { HttpParamsValidator } from './params';

export class HttpQueryValidator extends HttpParamsValidator<IHttpNameValues, IHttpQueryParam> {
  constructor(
    registry: IHttpParamDeserializerRegistry<IHttpNameValues>,
    prefix: string,
    style: HttpParamStyles = HttpParamStyles.Form
  ) {
    super(registry, prefix, style);
  }
  public validate(
    target: IHttpNameValues,
    specs: IHttpQueryParam[],
    mediaType?: string
  ): IValidation[] {
    return super.validate(target, specs, mediaType);
  }
}
