import { HttpParamDeserializerRegistry } from './HttpParamDeserializerRegistry';
import { DeepObjectStyleDeserializer } from './style/DeepObjectStyleDeserializer';
import { DelimitedStyleDeserializer } from './style/DelimitedStyleDeserializer';
import { FormStyleDeserializer } from './style/FormStyleDeserializer';
import { SimpleStyleDeserializer } from './style/SimpleStyleDeserializer';
import {
  DeserializeHttpHeader,
  DeserializeHttpQuery,
  IHttpHeaderParamStyleDeserializer,
  IHttpQueryParamStyleDeserializer,
} from './types';

export const header = new HttpParamDeserializerRegistry<
  IHttpHeaderParamStyleDeserializer,
  DeserializeHttpHeader
>([new SimpleStyleDeserializer()]);

export const query = new HttpParamDeserializerRegistry<
  IHttpQueryParamStyleDeserializer,
  DeserializeHttpQuery
>([
  new FormStyleDeserializer(),
  new DelimitedStyleDeserializer('%20', 'spaceDelimited'),
  new DelimitedStyleDeserializer('|', 'pipeDelimited'),
  new DeepObjectStyleDeserializer(),
]);
