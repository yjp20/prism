import { IHttpOperation } from '@stoplight/types';
import { createInstance } from '../index';

// TODO: Turn examples into test cases -> https://stoplightio.atlassian.net/wiki/spaces/PN/pages/5996560/Prism+Feature+List+draft
describe('Prism Mock Http', () => {
  const prism = createInstance({
    config: async req => {
      // mock all requests
      return {
        mock: true,
      };
    },
    loader: {
      load: async (): Promise<IHttpOperation[]> => {
        return [
          {
            id: 'todos',
            method: 'get',
            path: '/todos',
            responses: [
              {
                code: '200',
                content: [
                  {
                    mediaType: 'application/json',
                    examples: [
                      {
                        key: 'application/json',
                        value: [
                          {
                            id: 1,
                            completed: true,
                            name: 'make prism',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ];
      },
    },
  });

  beforeAll(() => {
    prism.load();
  });

  describe('features', () => {
    test('Should mock back static application/json example 200 response for /todos operation', async () => {
      const response = await prism.process({
        method: 'get',
        host: 'http://todos.stoplight.io',
        path: '/todos',
      });

      expect(response.statusCode).toEqual(200);
      expect(response.headers).toEqual({
        'content-type': 'application/json',
      });
      expect(response.body).toEqual([
        {
          id: 1,
          completed: true,
          name: 'make prism',
        },
      ]);
    });
  });
});
