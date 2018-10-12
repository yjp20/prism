import { IMockProvider } from './IMockProvider';
import { Protocol } from './IOperationOptions';

export interface IMockProviderRegistry {
  registerMockProvider(protocol: Protocol.HTTP, provider: IMockProvider): void;
  getMockProvider(protocol: Protocol.HTTP): IMockProvider | undefined;
}
