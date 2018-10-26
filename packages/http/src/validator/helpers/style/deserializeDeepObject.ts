import { ISchema } from '@stoplight/types/schema';

export function deserializeDeepObject(key: string, query: string, schema: ISchema): any {
  if (schema.type === 'object') {
    return deserializeObject(key, query, schema);
  } else {
    throw new Error('Deep object style is only applicable to object parameter');
  }
}

function deserializeObject(key: string, query: string, schema: ISchema) {
  const pairs = query.split('&');

  function resolve(path: string[]) {
    const name = key + path.map(el => `[${el}]`).join('');

    pairs.reduce((result: string | undefined, pair) => {
      const [k, v] = pair.split('=');

      if (k === name) {
        return v;
      }

      return result;
    }, undefined);
  }

  function construct(currentPath: string[], props: any): object {
    return Object.keys(props).reduce((result, k) => {
      const def = props[k];
      if (def.type === 'object') {
        return { ...result, [k]: construct([...currentPath, k], def.properties || {}) };
      }

      return { ...result, [k]: resolve([...currentPath, k]) };
    }, {});
  }

  return construct([], schema.properties || {});
}
