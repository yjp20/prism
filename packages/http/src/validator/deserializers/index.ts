import { HttpParamDeserializerRegistry } from './registry';
import {
  DeepObjectStyleDeserializer,
  DelimitedStyleDeserializer,
  FormStyleDeserializer,
  SimpleStyleDeserializer,
} from './style';
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
