import { IHttpOperation } from '@stoplight/types';
import { IHttpMethod, IHttpRequest } from '@stoplight/prism-http/types';
import { IPrismInput } from '@stoplight/prism-core/types';

export const httpOperations: IHttpOperation[] = [
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

export const httpRequests: Array<IPrismInput<IHttpRequest>> = [
  {
    validations: {
      input: [],
    },
    data: {
      method: 'get' as IHttpMethod,
      path: '/todos',
      host: '',
    },
  },
];
