# Prism Server

Usage:

```js
import { createServer } from '@stoplight/prism-http-server';

const server = createServer({
  path: './api.oas2.json',
});

server.listen(3000).then(() => {
  console.log('server is listening!');
});
```
