import {
  header as headerDeserializerRegistry,
  query as queryDeserializerRegistry,
} from './deserializer';
import { HttpValidator } from './HttpValidator';
import { validatorRegistry } from './registry';
import { HttpBodyValidator } from './structure/HttpBodyValidator';
import { HttpHeadersValidator } from './structure/HttpHeadersValidator';
import { HttpQueryValidator } from './structure/HttpQueryValidator';

export const validator = new HttpValidator(
  new HttpBodyValidator(validatorRegistry),
  new HttpHeadersValidator(headerDeserializerRegistry),
  new HttpQueryValidator(queryDeserializerRegistry)
);
