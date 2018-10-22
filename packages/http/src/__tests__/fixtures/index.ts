import { IPrismInput, ValidationSeverity } from '@stoplight/prism-core/types';
import { IHttpMethod, IHttpRequest } from '@stoplight/prism-http/types';
import { IHttpOperation } from '@stoplight/types';

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
          {
            mediaType: 'text/plain',
            examples: [
              {
                key: 'text',
                value: 'some text',
              },
              {
                key: 'plain',
                value: 'some plain',
              },
            ],
          },
        ],
      },
      {
        code: '400',
        content: [
          {
            mediaType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
              required: ['message'],
            },
            examples: [
              {
                key: 'application/json',
                value: [
                  {
                    message: 'error',
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
          {
            mediaType: 'application/xml',
            examples: [
              {
                key: 'xml',
                value: '<todo><name>Shopping</name><completed>false</completed></todo>',
              },
            ],
          },
        ],
      },
      {
        code: '400',
        content: [
          {
            mediaType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
              required: ['message'],
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
      url: { path: '/todos', baseUrl: '' },
    },
  },
  {
    validations: {
      input: [
        {
          path: ['/'],
          name: 'x',
          summary: 'x',
          severity: ValidationSeverity.ERROR,
          message: 'message',
        },
      ],
    },
    data: {
      method: 'get' as IHttpMethod,
      url: { path: '/todos/5', baseUrl: '' },
    },
  },
];
