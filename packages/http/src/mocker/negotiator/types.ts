import { INodeExample, INodeExternalExample } from '@stoplight/types/graph';
import { ISchema } from '@stoplight/types/schemas';

export interface IHttpNegotiationResult {
  code: string;
  mediaType: string;
  example?: INodeExample | INodeExternalExample;
  schema?: ISchema;
}
