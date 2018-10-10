import { IMockResult } from './IMockResult';
import { INode } from '@stoplight/types';
import { IOperationOptions } from './IOperationOptions';

export interface IMockProvider<N = INode, O = IOperationOptions, R = IMockResult<any>> {
  mock: (operation: N, options: O) => Promise<R>;
}
