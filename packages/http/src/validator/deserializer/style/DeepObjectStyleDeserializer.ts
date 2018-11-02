import { ISchema } from '@stoplight/types/schema';

import { IHttpQueryParamStyleDeserializer } from '../types';

export class DeepObjectStyleDeserializer implements IHttpQueryParamStyleDeserializer {
  public supports(style: string) {
    return style === 'deepObject';
  }

  public deserialize(
    key: string,
    query: {
      [name: string]: string | string[];
    },
    schema: ISchema
  ) {
    function resolve(path: string[]) {
      return key + path.map(el => `[${el}]`).join('');
    }

    function constructArray(currentPath: string[], items: any): object[] {
      const path = resolve(currentPath)
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]');

      const regexp = new RegExp(`^${path}\\[([0-9]+)\\]`);

      const indexes = Object.keys(query).reduce((list, k) => {
        const matches = k.match(regexp);

        if (!matches) {
          return list;
        }

        return { ...list, [matches[1]]: null };
      }, {});

      return Object.keys(indexes).map(i => construct([...currentPath, String(i)], items));
    }

    function constructObject(currentPath: string[], props: any): object {
      return Object.keys(props).reduce(
        (result, k) => ({ ...result, [k]: construct([...currentPath, k], props[k]) }),
        {}
      );
    }

    function construct(currentPath: string[], def: any): any {
      if (def.type === 'object') {
        return constructObject(currentPath, def.properties || {});
      }

      if (def.type === 'array') {
        return constructArray(currentPath, def.items || {});
      }

      return query[resolve(currentPath)];
    }

    return construct([], schema);
  }
}
