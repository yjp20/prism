import { HttpParamStyles, ISchema } from '@stoplight/types';

import { IHttpNameValue, IHttpNameValues } from '../../types';

export interface IHttpParamDeserializerRegistry<Parameters, S = HttpParamStyles> {
  get(style: S): IHttpParamStyleDeserializer<Parameters> | undefined;
}

export interface IHttpParamStyleDeserializer<Parameters, S = HttpParamStyles> {
  supports: (style: S) => boolean;
  deserialize: (name: string, parameters: Parameters, schema: ISchema, explode?: boolean) => any;
}

export type IHttpHeaderParamStyleDeserializer = IHttpParamStyleDeserializer<IHttpNameValue>;
export type IHttpQueryParamStyleDeserializer = IHttpParamStyleDeserializer<IHttpNameValues>;
