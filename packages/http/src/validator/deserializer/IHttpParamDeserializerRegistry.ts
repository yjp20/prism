export interface IHttpParamDeserializerRegistry<T extends Function> {
  get(style: string): T | undefined;
}
