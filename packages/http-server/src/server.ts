const express = require('express');
import { createInstance } from '@stoplight/prism-http';
import { getHttpConfigFromRequest } from './getHttpConfigFromRequest';

const app = express();
const port = 3000;

// TODO: this is a trivial example, scratch code
const prism = createInstance({
  config: getHttpConfigFromRequest,
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
