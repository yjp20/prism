import { IExample } from '@stoplight/types/http';
import { ISchema } from '@stoplight/types/schema';

export interface IHttpNegotiationResult {
  code: string;
  mediaType: string;
  example?: IExample;
  schema?: ISchema;
}
