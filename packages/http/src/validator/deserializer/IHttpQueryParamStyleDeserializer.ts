import { ISchema } from '@stoplight/types/schema';

import { IHttpParamStyleDeserializer } from './IHttpParamStyleDeserializer';

export type DeserializeHttpQuery = (
  key: string,
  query: {
    [name: string]: string | string[];
  },
  schema: ISchema,
  explode: boolean
) => any;

export interface IHttpQueryParamStyleDeserializer
  extends IHttpParamStyleDeserializer<DeserializeHttpQuery> {
  deserialize: DeserializeHttpQuery;
}
