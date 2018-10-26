import { IHttpParamStyleDeserializer } from '@stoplight/prism-http/validator/deserializer/IHttpParamStyleDeserializer';

export class HttpParamDeserializerRegistry<
  D extends IHttpParamStyleDeserializer<T>,
  T extends Function
> {
  constructor(private deserializers: D[]) {}

  public get(style: string): T | undefined {
    const deserializer = this.deserializers.find(d => d.supports(style));

    if (!deserializer) {
      return;
    }

    return deserializer.deserialize.bind(deserializer);
  }
}
