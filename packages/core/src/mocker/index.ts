import { INode } from '@stoplight/types';

import {
  IMockProvider,
  IMockProviderRegistry,
  IMockResult,
  IOperationOptions,
  Protocol,
} from './types';

export class Mocker implements IMockProviderRegistry {
  private _mockProviders: Map<string, IMockProvider> = new Map();

  public async mock(operation: INode, options: IOperationOptions): Promise<IMockResult> {
    const { protocol } = options;
    const provider = this.getMockProvider(protocol);
    if (!provider) {
      throw new Error(`No mock provider found for protocol '${protocol}'`);
    }
    return provider.mock(operation, options);
  }

  /**
   * Get a children provider for the given node type.
   */
  public getMockProvider = (protocol: Protocol): IMockProvider | undefined => {
    return this._mockProviders.get(protocol);
  };

  /**
   * Register the given child provider for the given node type.
   *
   * Throw if a provider is already registered for the given node type.
   */
  public registerMockProvider<T extends IMockProvider>(protocol: Protocol, provider: T): void {
    if (this._mockProviders.get(protocol)) {
      throw new Error(`A mock provider for protocol '${protocol}' is already registered.`);
    }
    this._mockProviders.set(protocol, provider);
  }
}
