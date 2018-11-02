import { IHttpQueryParam } from '@stoplight/types';
import { HttpParamStyles } from '@stoplight/types/http.d';

import { IValidation } from '@stoplight/prism-core';
import { IHttpNameValues } from '../../types';
import { IHttpParamDeserializerRegistry } from '../deserializers/types';
import { HttpParamsValidator } from './params';

export class HttpQueryValidator extends HttpParamsValidator<IHttpNameValues, IHttpQueryParam> {
  public validate(
    target: IHttpNameValues,
    specs: IHttpQueryParam[],
    registry: IHttpParamDeserializerRegistry<IHttpNameValues>,
    prefix: string,
    mediaType?: string
  ): IValidation[] {
    return super.validate(target, specs, registry, prefix, mediaType, 'form' as HttpParamStyles);
  }
}
