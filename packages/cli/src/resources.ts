export default [
  {
    id: '1',
    method: 'get',
    path: '/',
    servers: [{ url: 'http://localhost:3000' }],
    responses: [
      {
        code: '200',
        contents: [{ mediaType: 'application/json', schema: { type: 'string' } }],
      },
    ],
  },
  {
    id: '1',
    method: 'post',
    path: '/todos',
    servers: [{ url: 'http://localhost:3000' }],
    responses: [
      {
        code: '201',
        contents: [{ mediaType: 'application/json', schema: { type: 'string' } }],
      },
      {
        code: '401',
        contents: [{ mediaType: 'application/json', schema: { type: 'string' } }],
      },
    ],
  },
];
