import { IOperationOptions, Protocol } from '../IOperationOptions';

export interface IRpcOperationOptions extends IOperationOptions {
  protocol: Protocol.RPC;
  service: string;
  method: string;
  data: object;
}
