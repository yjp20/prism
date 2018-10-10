import { IHttpOperation } from '@stoplight/types';
import { HttpProvider } from './HttpProvider';
import { IHttpOperationOptions } from './IHttpOperationOptions';
import { Protocol } from '../IOperationOptions';

describe('HttpProvider', () => {
  let httpProvider: HttpProvider;

  beforeEach(() => {
    httpProvider = new HttpProvider();
  });

  describe('mock()', () => {
    it('mocks correctly for given status/contentType/example', async () => {
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

      expect(await httpProvider.mock(operation, options)).toMatchSnapshot();
    });

    it('fails when status code is missing', async () => {
      const operation: IHttpOperation = {
        id: 'id',
        method: 'GET',
        path: '/test',
        responses: [],
      };

      const options: IHttpOperationOptions = {
        protocol: Protocol.HTTP,
        dynamic: false,
        status: '200',
        contentType: 'application/json',
        example: 'example1',
      };

      expect(httpProvider.mock(operation, options)).rejects.toThrowErrorMatchingSnapshot();
    });

    it('fails when media type is missing', async () => {
      const operation: IHttpOperation = {
        id: 'id',
        method: 'GET',
        path: '/test',
        responses: [
          {
            code: '200',
            content: [],
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

      expect(httpProvider.mock(operation, options)).rejects.toThrowErrorMatchingSnapshot();
    });

    it('fails when example is missing', async () => {
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
                examples: [],
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

      expect(httpProvider.mock(operation, options)).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
