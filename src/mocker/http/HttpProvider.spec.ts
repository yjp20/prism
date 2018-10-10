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
    it('mocks', async () => {
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
  });
});
