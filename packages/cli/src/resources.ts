export default [
  {
    id: '1',
    method: 'get',
    path: '/',
    request: {
      cookie: [],
      headers: [],
      path: [],
      query: [],
    },
    security: [],
    servers: [{ url: 'http://localhost:3000' }],
    responses: [
      {
        code: '200',
        contents: [
          {
            mediaType: 'application/json',
            schema: { type: 'string' },
            examples: [],
            encodings: [],
          },
        ],
        headers: [],
      },
    ],
  },
  {
    id: '1',
    method: 'post',
    path: '/todos',
    servers: [{ url: 'http://localhost:3000' }],
    security: [],
    request: {
      cookie: [],
      headers: [],
      path: [],
      query: [],
    },
    responses: [
      {
        code: '201',
        contents: [
          {
            mediaType: 'application/json',
            schema: { type: 'string' },
            examples: [],
            encodings: [],
          },
        ],
        headers: [],
      },
      {
        code: '401',
        contents: [
          {
            mediaType: 'application/json',
            schema: { type: 'string' },
            examples: [],
            encodings: [],
          },
        ],
        headers: [],
      },
    ],
  },
];
