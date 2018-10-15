import { IMockProvider } from '../IMockProvider';
import { IMockResult } from '../IMockResult';
import { IMockRpcResponse } from './IMockRpcResponse';
import { IRpcOperationOptions } from './IRpcOperationOptions';

export class RpcProvider
  implements IMockProvider<any, IRpcOperationOptions, IMockResult<IMockRpcResponse>> {
  public async mock(operation: any, options: IRpcOperationOptions) {
    // call lookup(opts) or whatever
    // any extra logic...
    return {
      data: {
        result: {},
      },
    };
  }
}
