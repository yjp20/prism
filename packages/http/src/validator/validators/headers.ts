import { IHttpHeaderParam } from '@stoplight/types';
import { HttpParamStyles } from '@stoplight/types/http.d';

import { IValidation } from '@stoplight/prism-core';
import { IHttpNameValue } from '../../types';
import { IHttpParamDeserializerRegistry } from '../deserializers/types';
import { HttpParamsValidator } from './params';

export class HttpHeadersValidator extends HttpParamsValidator<IHttpNameValue, IHttpHeaderParam> {
  public validate(
    target: IHttpNameValue,
    specs: IHttpHeaderParam[],
    registry: IHttpParamDeserializerRegistry<IHttpNameValue>,
    prefix: string,
    mediaType?: string
  ): IValidation[] {
    return super.validate(target, specs, registry, prefix, mediaType, 'simple' as HttpParamStyles);
  }
}
