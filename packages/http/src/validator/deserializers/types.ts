import { ISchema } from '@stoplight/types/schema';

import { IHttpNameValues } from '../../types';

export type DeserializeHttpHeader = (value: string, type: string, explode: boolean) => any;

export interface IHttpHeaderParamStyleDeserializer {
  supports: (style: string) => boolean;
  deserialize: DeserializeHttpHeader;
}

export interface IHttpParamDeserializerRegistry<T extends Function> {
  get(style: string): T | undefined;
}

export interface IHttpParamStyleDeserializer<T> {
  supports: (style: string) => boolean;
  deserialize: T;
}

export type DeserializeHttpQuery = (
  key: string,
  query: IHttpNameValues,
  schema: ISchema,
  explode: boolean
) => any;

export interface IHttpQueryParamStyleDeserializer
  extends IHttpParamStyleDeserializer<DeserializeHttpQuery> {
  deserialize: DeserializeHttpQuery;
}
