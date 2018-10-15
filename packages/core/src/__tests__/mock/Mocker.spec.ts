import { IHttpOperation, INode } from '@stoplight/types';
import { IHttpOperationOptions } from '../../mock/http/IHttpOperationOptions';
import { IMockResult } from '../../mock/IMockResult';
import { IOperationOptions, Protocol } from '../../mock/IOperationOptions';
import { Mocker } from '../../mock/Mocker';

describe('Mocker', () => {
  let mocker: Mocker;

  beforeEach(() => {
    mocker = new Mocker();
  });

  describe('registerMockProvider()', () => {
    it('registers correctly mock provider', () => {
      const provider = {
        async mock(_: INode, __: IOperationOptions): Promise<IMockResult<any>> {
          return { data: { status: 200 } };
        },
      };

      mocker.registerMockProvider(Protocol.HTTP, provider);

      expect(mocker.getMockProvider(Protocol.HTTP)).toEqual(provider);
    });
  });

  describe('getMockProvider()', () => {
    it('fails when provider does not exists', () => {
      expect(mocker.getMockProvider(Protocol.HTTP)).toBeUndefined();
    });
  });

  describe('mock()', () => {
    it('passes mock operation/options to proper provider', () => {
      const operation: IHttpOperation = {
        id: 'id',
        method: 'GET',
        path: '/test',
        responses: [
          {
            code: '200',
            content: [
              {
                mediaType: 'application/json',
                examples: [{ key: 'example1', value: '{"test":"value"}' }],
              },
            ],
          },
        ],
      };

      const options: IHttpOperationOptions = {
        protocol: Protocol.HTTP,
        dynamic: false,
        status: '200',
        contentType: 'application/json',
        example: 'example1',
      };

      const provider = {
        async mock(_: INode, __: IOperationOptions): Promise<IMockResult<any>> {
          return { data: { status: 200 } };
        },
      };

      const providerMockSpy = jest.spyOn(provider, 'mock');

      mocker.registerMockProvider(Protocol.HTTP, provider);

      mocker.mock(operation, options);

      expect(providerMockSpy).toHaveBeenCalledTimes(1);
      expect(providerMockSpy).toHaveBeenCalledWith(operation, options);
    });
  });
});
