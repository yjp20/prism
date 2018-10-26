import { ISchema } from '@stoplight/types/schema';
import { IHttpQueryParamStyleDeserializer } from '../IHttpQueryParamStyleDeserializer';

export class DelimitedStyleDeserializer implements IHttpQueryParamStyleDeserializer {
  constructor(private readonly separator: string, private readonly styleName: string) {}
  public supports(style: string) {
    return style === this.styleName;
  }

  public deserialize(key: string, query: string, schema: ISchema, explode: boolean) {
    if (schema.type === 'array') {
      return explode ? this.deserializeImplodeArray(key, query) : this.deserializeArray(key, query);
    } else {
      throw new Error('Space/pipe/.. delimited style is only applicable to array parameter');
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

      return v === '' ? [] : v.split(this.separator);
    }, undefined);
  }
}
