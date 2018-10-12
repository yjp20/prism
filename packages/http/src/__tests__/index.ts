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
                    schema: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string',
                          },
                          completed: {
                            type: 'boolean',
                          },
                        },
                        required: ['name', 'completed'],
                      },
                    },
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
                      {
                        key: 'bear',
                        value: [
                          {
                            id: 2,
                            completed: false,
                            name: 'make bears',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'todo',
            method: 'get',
            path: '/todos/{todoId}',
            responses: [
              {
                code: '200',
                content: [
                  {
                    mediaType: 'application/json',
                    schema: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                        },
                        completed: {
                          type: 'boolean',
                        },
                      },
                      required: ['name', 'completed'],
                    },
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

  test.skip('Should mock back static bear example 200 response for /todos operation', async () => {
    // TODO
  });

  test('Should dynamically generate 200 json response for /todos when dynamic option is true.', async () => {
    // Should dynamically generate a 200 response.
    const response = prism.process(
      {
        method: 'post',
        host: 'http://todos.stoplight.io',
        path: '/todos',
      },
      {
        dynamic: true,
      }
    );

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({
      'content-type': 'application/json',
    });
    // TODO: Figure out a way to test if a body was dynmiacally generated. Easiest way off the top of my head is to annotate
    // is to add a header to the response that indicates dynamic mocking was performed.
    // expect(response.body).toEqual([]);
  });

  test.skip('Should fallback to dyanmically generating a 200 json response for /todos/{todoId} when examples aren not defined', async () => {
    // TODO
  });
});
