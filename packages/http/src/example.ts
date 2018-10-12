import { createInstance } from './index';

// Just a little example. Remove this eventually.

const prism = createInstance({
  config: async req => {
    // only mock post requests
    return {
      mock: req.method === 'post',
    };
  },
});

prism.load({
  path: './foo.json',
});

// will not be mocked, since it is a get request and options factory above only mocks post
let response = prism.process({
  method: 'get',
  host: 'http://todos.stoplight.io',
  path: '/todos',
});

// will be mocked, since it is a post request. also, we are specifically asking for 400 response
response = prism.process(
  {
    method: 'post',
    host: 'http://todos.stoplight.io',
    path: '/todos',
  },
  {
    mock: {
      code: 400,
    },
  }
);
