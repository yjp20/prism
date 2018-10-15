import { INode } from '@stoplight/types';

export interface IMockProvider<N = INode, O = IOperationOptions, R = IMockResult<any>> {
  mock: (operation: N, options: O) => Promise<R>;
}

export interface IMockProviderRegistry {
  registerMockProvider(protocol: Protocol.HTTP, provider: IMockProvider): void;
  getMockProvider(protocol: Protocol.HTTP): IMockProvider | undefined;
}

export enum Protocol {
  HTTP = 'http',
  RPC = 'rpc',
}

export interface IOperationOptions {
  protocol: Protocol.HTTP | Protocol.RPC;
  dynamic?: boolean;
}

export interface IMockResult<T = any> {
  data: T;
}
