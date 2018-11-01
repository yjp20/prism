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
    if (schema.type === 'object') {
      return this.deserializeObject(key, query, schema);
    } else {
      throw new Error('Deep object style is only applicable to object parameter');
    }
  }

  private deserializeObject(
    key: string,
    query: {
      [name: string]: string | string[];
    },
    schema: ISchema
  ) {
    function resolve(path: string[]) {
      const name = key + path.map(el => `[${el}]`).join('');
      return query[name];
    }

    function construct(currentPath: string[], props: any): object {
      return Object.keys(props).reduce((result, k) => {
        const def = props[k];
        if (def.type === 'object') {
          return { ...result, [k]: construct([...currentPath, k], def.properties || {}) };
        }

        // todo: implement array support?

        return { ...result, [k]: resolve([...currentPath, k]) };
      }, {});
    }

    return construct([], schema.properties || {});
  }
}
