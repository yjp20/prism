import { ISchema } from '@stoplight/types/schema';
import { deserializeDelimited } from './deserializeDelimited';

export function deserializeSpaceDelimited(
  key: string,
  query: string,
  schema: ISchema,
  explode: boolean = true
): any {
  return deserializeDelimited(key, query, schema, '%20', explode);
}
