const express = require('express');
import { createInstance, IHttpConfig, IHttpMethod } from '@stoplight/prism-http';
import { Request, Response } from 'express';

const app = express();
const port = 3000;

// TODO: this is a trivial example, scratch code
const prism = createInstance({
  config: async ({ query }) => {
    const config: IHttpConfig = {
      mock: false,
    };

    if (query && query.__code) {
      config.mock = {
        code: query.__code,
      };
    }

    return config;
  },
})({
  path: 'foo.json',
});

app.get('*', async (req: Request, res: Response) => {
  const response = await prism.process({
    method: req.method as IHttpMethod,
    host: req.host,
    path: req.path,
  });

  if (response.data) {
    res.send(response.data);
  } else {
    // not found or something?
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
