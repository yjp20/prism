import { ISchema } from '@stoplight/types/schema';
import { createObjectFromKeyValList } from '../../helpers/createObjectFromKeyValList';

import { IHttpQueryParamStyleDeserializer } from '../IHttpQueryParamStyleDeserializer';

export class FormStyleDeserializer implements IHttpQueryParamStyleDeserializer {
  public supports(style: string) {
    return style === 'form';
  }

  public deserialize(key: string, query: string, schema: ISchema, explode: boolean = true) {
    if (schema.type === 'array') {
      return explode ? this.deserializeImplodeArray(key, query) : this.deserializeArray(key, query);
    } else if (schema.type === 'object') {
      return explode
        ? this.deserializeImplodeObject(query, schema)
        : this.deserializeObject(key, query);
    } else {
      return this.deserializePrimitive(key, query);
    }
  }

  private deserializeImplodeArray(key: string, query: string) {
    return query.split('&').reduce((result: string[], pair) => {
      const [k, v] = pair.split('=');

      if (k !== key) {
        return result;
      }

      return [...(result || []), v];
    }, []);
  }

  private deserializeArray(key: string, query: string) {
    return query.split('&').reduce((result: string[] | undefined, pair) => {
      const [k, v] = pair.split('=');

      if (k !== key) {
        return result;
      }

      return v === '' ? [] : v.split(',');
    }, undefined);
  }

  private deserializeImplodeObject(query: string, schema: ISchema) {
    const properties = schema.properties || {};

    return query.split('&').reduce((result: object, pair) => {
      const [k, v] = pair.split('=');

      if (!properties.hasOwnProperty(k)) {
        return result;
      }

      return { ...result, [k]: v };
    }, {});
  }

  private deserializeObject(key: string, query: string) {
    return query.split('&').reduce((result: object | undefined, pair) => {
      const [k, v] = pair.split('=');

      if (k !== key) {
        return result;
      }

      return createObjectFromKeyValList(v.split(','));
    }, undefined);
  }

  private deserializePrimitive(key: string, query: string) {
    return query.split('&').reduce((result: string | undefined, pair) => {
      const [k, v] = pair.split('=');

      if (k !== key) {
        return result;
      }

      return v;
    }, undefined);
  }
}
