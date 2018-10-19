const express = require('express');
import { createInstance, IHttpConfig, IHttpRequest } from '@stoplight/prism-http';

const app = express();
const port = 3000;

// TODO: this is a trivial example, scratch code
const prism = createInstance({
  config: async (request: IHttpRequest) => {
    const config: IHttpConfig = { mock: true };
    const { url } = request;

    if (url.query && url.query.__code) {
      config.mock = {
        code: url.query.__code,
      };
    }

    return config;
  },
})({
  path: 'foo.json',
});

app.get('*', async (req: any, res: any) => {
  const response = await prism.process({
    method: req.method,
    url: { baseUrl: req.host, path: req.path },
  });

  if (response.data) {
    res.send(response.data);
  } else {
    // not found or something?
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
