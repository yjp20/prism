import { HttpParamStyles, IHttpHeaderParam } from '@stoplight/types';

import { IValidation } from '@stoplight/prism-core';
import { IHttpNameValue } from '../../types';
import { IHttpParamDeserializerRegistry } from '../deserializers/types';
import { HttpParamsValidator } from './params';

export class HttpHeadersValidator extends HttpParamsValidator<IHttpNameValue, IHttpHeaderParam> {
  constructor(
    registry: IHttpParamDeserializerRegistry<IHttpNameValue>,
    prefix: string,
    style: HttpParamStyles = HttpParamStyles.Simple
  ) {
    super(registry, prefix, style);
  }

  public validate(
    target: IHttpNameValue,
    specs: IHttpHeaderParam[],
    mediaType?: string
  ): IValidation[] {
    return super.validate(target, specs, mediaType);
  }
}
