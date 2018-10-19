import { IMocker } from '@stoplight/prism-core';

import { IMockRpcResponse } from './IMockRpcResponse';
import { IRpcOperationOptions } from './IRpcOperationOptions';

export class RpcProvider implements IMocker<any, any, IRpcOperationOptions, IMockRpcResponse> {
  public async mock({}) {
    // call lookup(opts) or whatever
    // any extra logic...
    return {
      result: {},
    };
  }
}
