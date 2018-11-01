import { ISchema } from '@stoplight/types/schema';

import { IHttpQueryParamStyleDeserializer } from '../types';
import { createObjectFromKeyValList } from './utils';

export class FormStyleDeserializer implements IHttpQueryParamStyleDeserializer {
  public supports(style: string) {
    return style === 'form';
  }

  public deserialize(
    key: string,
    query: {
      [name: string]: string | string[];
    },
    schema: ISchema,
    explode: boolean = true
  ) {
    if (schema.type === 'array') {
      return explode ? this.deserializeImplodeArray(query[key]) : this.deserializeArray(query[key]);
    } else if (schema.type === 'object') {
      return explode
        ? this.deserializeImplodeObject(query, schema)
        : this.deserializeObject(query[key]);
    } else {
      return query[key];
    }
  }

  private deserializeImplodeArray(value: string | string[]) {
    return Array.isArray(value) ? value : [value];
  }

  private deserializeArray(value: string | string[]) {
    if (Array.isArray(value)) {
      // last query param is taken into account
      value = value[value.length - 1];
    }

    return value.split(',');
  }

  private deserializeImplodeObject(
    query: {
      [name: string]: string | string[];
    },
    schema: ISchema
  ) {
    const properties = schema.properties || {};

    return Object.keys(query).reduce((result: object, key) => {
      const value = query[key];

      if (!properties.hasOwnProperty(key)) {
        return result;
      }

      return { ...result, [key]: value };
    }, {});
  }

  private deserializeObject(value: string | string[]) {
    if (Array.isArray(value)) {
      // last query param is taken into account
      value = value[value.length - 1];
    }

    return createObjectFromKeyValList(value.split(','));
  }
}
