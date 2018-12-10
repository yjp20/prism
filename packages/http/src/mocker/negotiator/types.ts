import { INodeExample, INodeExternalExample, ISchema } from '@stoplight/types';

export interface IHttpNegotiationResult {
  code: string;
  mediaType: string;
  example?: INodeExample | INodeExternalExample;
  schema?: ISchema;
}
