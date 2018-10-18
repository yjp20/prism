const express = require('express');
const app = express();
const port = 3000;

import { createInstance, IHttpConfig } from '@stoplight/prism-http';

// TODO: this is a trivial example, scratch code

const prism = createInstance({
  config: async ({ query }) => {
    const config: IHttpConfig = {};

    if (query && query.__code) {
      config.mock = {
        code: query.__code,
      };
    }

    return config;
  },
});

app.get('*', async (req: any, res: any) => {
  const response = await prism.process({ method: req.method, host: req.host, path: req.path });

  if (response.data) {
    res.send(response.data);
  } else {
    // not found or something?
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
