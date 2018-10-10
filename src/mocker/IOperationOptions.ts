export enum Protocol {
  HTTP = 'http',
  RPC = 'rpc',
}

export interface IOperationOptions {
  protocol: Protocol.HTTP | Protocol.RPC;
  dynamic?: boolean;
}
