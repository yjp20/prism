import { ISchema } from '@stoplight/types/schema';
import { IHttpQueryParamStyleDeserializer } from '../IHttpQueryParamStyleDeserializer';

export class DelimitedStyleDeserializer implements IHttpQueryParamStyleDeserializer {
  constructor(private readonly separator: string, private readonly styleName: string) {}
  public supports(style: string) {
    return style === this.styleName;
  }

  public deserialize(
    key: string,
    query: {
      [name: string]: string | string[];
    },
    schema: ISchema,
    explode: boolean
  ) {
    if (schema.type === 'array') {
      return explode ? this.deserializeImplodeArray(query[key]) : this.deserializeArray(query[key]);
    } else {
      throw new Error('Space/pipe/.. delimited style is only applicable to array parameter');
    }
  }

  private deserializeImplodeArray(value: string | string[]) {
    return Array.isArray(value) ? value : [value];
  }

  private deserializeArray(value: string | string[]) {
    if (Array.isArray(value)) {
      // todo: use last value? that's what most parsers do?
      throw new Error('Multiple query parameters are not allowed when explode is disabled');
    }

    return value.split(this.separator);
  }
}
