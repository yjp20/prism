import { IPrismConfig } from '@stoplight/prism-core';

export interface IRpcOperationOptions extends IPrismConfig {
  service: string;
  method: string;
  data: object;
}
