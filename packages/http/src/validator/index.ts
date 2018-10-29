import {
  header as headerDeserializerRegistry,
  query as queryDeserializerRegistry,
} from './deserializer';
import { HttpBodyValidator } from './helpers/HttpBodyValidator';
import { HttpHeadersValidator } from './helpers/HttpHeadersValidator';
import { HttpQueryValidator } from './helpers/HttpQueryValidator';
import { HttpValidator } from './HttpValidator';
import { validatorRegistry } from './registry';

export const validator = new HttpValidator(
  new HttpBodyValidator(validatorRegistry),
  new HttpHeadersValidator(headerDeserializerRegistry),
  new HttpQueryValidator(queryDeserializerRegistry)
);
