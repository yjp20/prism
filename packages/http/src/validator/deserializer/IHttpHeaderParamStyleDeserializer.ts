export type DeserializeHttpHeader = (value: string, type: string, explode: boolean) => any;

export interface IHttpHeaderParamStyleDeserializer {
  supports: (style: string) => boolean;
  deserialize: DeserializeHttpHeader;
}
