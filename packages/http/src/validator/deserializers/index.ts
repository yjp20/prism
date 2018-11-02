import { HttpParamStyles } from '@stoplight/types/http.d';

import { HttpParamDeserializerRegistry } from './registry';
import {
  DeepObjectStyleDeserializer,
  DelimitedStyleDeserializer,
  FormStyleDeserializer,
  SimpleStyleDeserializer,
} from './style';

export const header = new HttpParamDeserializerRegistry([new SimpleStyleDeserializer()]);

export const query = new HttpParamDeserializerRegistry([
  new FormStyleDeserializer(),
  new DelimitedStyleDeserializer('%20', HttpParamStyles.spaceDelimited),
  new DelimitedStyleDeserializer('|', HttpParamStyles.pipeDelimited),
  new DeepObjectStyleDeserializer(),
]);
