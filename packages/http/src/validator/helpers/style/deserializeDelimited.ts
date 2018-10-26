import { ISchema } from '@stoplight/types/schema';

export function deserializeDelimited(
  key: string,
  query: string,
  schema: ISchema,
  separator: string,
  explode: boolean = true
): any {
  if (schema.type === 'array') {
    return explode ? deserializeImplodeArray(key, query) : deserializeArray(key, query, separator);
  } else {
    throw new Error('Space/pipe/.. delimited style is only applicable to array parameter');
  }
}

function deserializeImplodeArray(key: string, query: string) {
  return query.split('&').reduce((result: string[], pair) => {
    const [k, v] = pair.split('=');

    if (k !== key) {
      return result;
    }

    return [...(result || []), v];
  }, []);
}

function deserializeArray(key: string, query: string, separator: string) {
  return query.split('&').reduce((result: string[] | undefined, pair) => {
    const [k, v] = pair.split('=');

    if (k !== key) {
      return result;
    }

    return v === '' ? [] : v.split(separator);
  }, undefined);
}
