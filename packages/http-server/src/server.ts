const express = require('express');
import { Request, Response } from 'express';
const app = express();
const port = 3000;

import { createInstance, types } from '@stoplight/prism-http';

// TODO: this is a trivial example, scratch code

const prism = createInstance({
  config: async ({ query }) => {
    const config: types.IHttpConfig = {};

    if (query && query.__code) {
      config.mock = {
        code: query.__code,
      };
    }

    return config;
  },
});

app.get('*', async (req: Request, res: Response) => {
  const response = await prism.process({ method: req.method, host: req.host, path: req.path });

  if (response.output) {
    res.send(response.output);
  } else {
    // not found or something?
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
