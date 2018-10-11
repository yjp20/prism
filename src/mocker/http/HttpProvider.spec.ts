import { IHttpOperation } from '@stoplight/types';
import { JSONSchemaExampleGenerator } from '../generator/JSONSchemaExampleGenerator';
import { Protocol } from '../IOperationOptions';
import { HttpProvider } from './HttpProvider';
import { IHttpOperationOptions } from './IHttpOperationOptions';

describe('HttpProvider', () => {
  const exampleGenerator = new JSONSchemaExampleGenerator();
  let httpProvider: HttpProvider;

  beforeEach(() => {
    httpProvider = new HttpProvider(exampleGenerator);
  });

  describe('mock()', () => {
    it('mocks correctly for given status/mediaType/example', async () => {
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
        mediaType: 'application/json',
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
        mediaType: 'application/json',
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
        mediaType: 'application/json',
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
        mediaType: 'application/json',
        example: 'example1',
      };

      expect(httpProvider.mock(operation, options)).rejects.toThrowErrorMatchingSnapshot();
    });

    describe('dynamic example generation', () => {
      it('generates dynamic example from schema', async () => {
        const schema = {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
          },
          required: ['name', 'email'],
        };

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
                  schema,
                },
              ],
            },
          ],
        };

        const options: IHttpOperationOptions = {
          protocol: Protocol.HTTP,
          dynamic: true,
          status: '200',
          mediaType: 'application/json',
        };

        const exampleGeneratorSpy = jest.spyOn(exampleGenerator, 'generate');

        await httpProvider.mock(operation, options);

        expect(exampleGeneratorSpy).toHaveBeenCalledTimes(1);
        expect(exampleGeneratorSpy).toHaveBeenCalledWith(schema, 'application/json');
      });

      it('fails when schema is missing', async () => {
        const operation: IHttpOperation = {
          id: 'id',
          method: 'GET',
          path: '/test',
          responses: [
            {
              code: '200',
              content: [{ mediaType: 'application/json' }],
            },
          ],
        };

        const options: IHttpOperationOptions = {
          protocol: Protocol.HTTP,
          dynamic: true,
          status: '200',
          mediaType: 'application/json',
        };

        expect(httpProvider.mock(operation, options)).rejects.toThrowErrorMatchingSnapshot();
      });
    });
  });
});
