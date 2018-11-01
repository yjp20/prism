import { IPrismInput, ValidationSeverity } from '@stoplight/prism-core';
import { IHttpMethod, IHttpRequest, IHttpResponse } from '@stoplight/prism-http';
import { IHttpOperation } from '@stoplight/types';

export const httpOperations: IHttpOperation[] = [
  {
    id: 'todos',
    method: 'get',
    path: '/todos',
    responses: [
      {
        code: '200',
        contents: [
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
            mediaType: 'application/xml',
            examples: [
              {
                key: 'first',
                value: '{ "root": "first" }',
              },
              {
                key: 'second',
                value: '{ "root": "second" }',
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
        code: '201',
        contents: [
          {
            mediaType: 'application/json',
            examples: [
              {
                key: 'first',
                value: '{ "root": "first" }',
              },
              {
                key: 'second',
                value: '{ "root": "second" }',
              },
            ],
          },
          {
            mediaType: 'application/xml',
            examples: [
              {
                key: 'first',
                value: '<root>first</root>',
              },
              {
                key: 'second',
                value: '<root>second</root>',
              },
            ],
          },
        ],
      },
      {
        code: '400',
        contents: [
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
        headers: [
          {
            name: 'x-todos-publish',
            content: {
              '*': {
                mediaType: '*',
                schema: { type: 'string', format: 'date-time' },
              },
            },
          },
        ],
        contents: [
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
        contents: [
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
  {
    id: 'todos',
    method: 'post',
    path: '/todos',
    responses: [],
    request: {
      body: {
        content: [
          {
            mediaType: 'application/json',
            schema: {
              type: 'object',
              properties: { name: { type: 'string' }, completed: { type: 'boolean' } },
              required: ['name', 'completed'],
            },
          },
        ],
      },
      query: [
        {
          name: 'overwrite',
          content: {
            '*': {
              mediaType: '*',
              schema: { type: 'string', pattern: '^(yes|no)$' },
            },
          },
        },
      ],
      headers: [
        {
          name: 'x-todos-publish',
          content: {
            '*': {
              mediaType: '*',
              schema: { type: 'string', format: 'date-time' },
            },
          },
        },
      ],
    },
  },
];

export const httpInputs: IHttpRequest[] = [
  {
    method: 'get' as IHttpMethod,
    url: { path: '/todos', baseUrl: '' },
  },
  {
    method: 'get' as IHttpMethod,
    url: { path: '/todos/5', baseUrl: '' },
  },
  {
    method: 'post',
    url: {
      path: '/',
      query: {
        overwrite: 'yes',
      },
    },
    body: '{"name":"Shopping","completed":true}',
    headers: {
      'x-todos-publish': '2018-11-01T10:50:00.05Z',
    },
  },
];

export const httpRequests: Array<IPrismInput<IHttpRequest>> = [
  {
    validations: {
      input: [],
    },
    data: httpInputs[0],
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
    data: httpInputs[1],
  },
];

export const httpOutputs: IHttpResponse[] = [
  {
    statusCode: 200,
  },
  {
    statusCode: 200,
    headers: {
      'x-todos-publish': '2018-11-01T11:42:00.05Z',
    },
    body: '{"name":"Shopping","completed":false}',
  },
];
