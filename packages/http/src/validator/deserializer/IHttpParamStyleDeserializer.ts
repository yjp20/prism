export interface IHttpParamStyleDeserializer<T> {
  supports: (style: string) => boolean;
  deserialize: T;
}
