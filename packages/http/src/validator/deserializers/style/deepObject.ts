import { HttpParamStyles } from '@stoplight/types/http.d';
import { ISchema } from '@stoplight/types/schema';

import { IHttpNameValues } from '../../../types';
import { IHttpQueryParamStyleDeserializer } from '../types';

export class DeepObjectStyleDeserializer implements IHttpQueryParamStyleDeserializer {
  public supports(style: HttpParamStyles) {
    return style === HttpParamStyles.deepObject;
  }

  public deserialize(name: string, parameters: IHttpNameValues, schema: ISchema) {
    if (schema.type === 'object') {
      return this.deserializeObject(name, parameters, schema);
    } else {
      throw new Error('Deep object style is only applicable to object parameter');
    }
  }

  private deserializeObject(key: string, parameters: IHttpNameValues, schema: ISchema) {
    function resolve(path: string[]) {
      const name = key + path.map(el => `[${el}]`).join('');
      return parameters[name];
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
