import { ISchema } from '@stoplight/types/schema';
import { createObjectFromKeyValList } from './createObjectFromKeyValList';

export function deserializeForm(
  key: string,
  query: string,
  schema: ISchema,
  explode: boolean = true
): any {
  if (schema.type === 'array') {
    return explode ? deserializeImplodeArray(key, query) : deserializeArray(key, query);
  } else if (schema.type === 'object') {
    return explode ? deserializeImplodeObject(query, schema) : deserializeObject(key, query);
  } else {
    return deserializePrimitive(key, query);
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

function deserializeArray(key: string, query: string) {
  return query.split('&').reduce((result: string[] | undefined, pair) => {
    const [k, v] = pair.split('=');

    if (k !== key) {
      return result;
    }

    return v === '' ? [] : v.split(',');
  }, undefined);
}

function deserializeImplodeObject(query: string, schema: ISchema) {
  const properties = schema.properties || {};

  return query.split('&').reduce((result: object, pair) => {
    const [k, v] = pair.split('=');

    if (!properties.hasOwnProperty(k)) {
      return result;
    }

    return { ...result, [k]: v };
  }, {});
}

function deserializeObject(key: string, query: string) {
  return query.split('&').reduce((result: object | undefined, pair) => {
    const [k, v] = pair.split('=');

    if (k !== key) {
      return result;
    }

    return createObjectFromKeyValList(v.split(','));
  }, undefined);
}

function deserializePrimitive(key: string, query: string) {
  return query.split('&').reduce((result: string | undefined, pair) => {
    const [k, v] = pair.split('=');

    if (k !== key) {
      return result;
    }

    return v;
  }, undefined);
}
