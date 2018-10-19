import { createInstance, IHttpMethod, TPrismHttpInstance } from '@stoplight/prism-http';
import * as fastify from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

import { getHttpConfigFromRequest } from './getHttpConfigFromRequest';
import { IPrismHttpServer, IPrismHttpServerOpts } from './types';

export const createServer = (opts: IPrismHttpServerOpts = {}): IPrismHttpServer => {
  const server = fastify<Server, IncomingMessage, ServerResponse>();

  const prism = createInstance({
    config: getHttpConfigFromRequest,
    ...(opts.components || {}),
  })(opts.fileLoader);

  server.all('*', {}, replyHandler(prism));

  const prismServer: IPrismHttpServer = {
    get prism() {
      return prism;
    },

    get fastify() {
      return server;
    },

    listen: async (...args) => {
      return server.listen(...args);
    },
  };

  return prismServer;
};

const replyHandler = (
  prism: TPrismHttpInstance
): fastify.RequestHandler<IncomingMessage, ServerResponse> => {
  return async (request, reply) => {
    const { req } = request;

    try {
      const response = await prism.process({
        method: (req.method || 'get') as IHttpMethod,
        url: {
          path: req.url || '/',
          query: request.query,
        },
        headers: request.headers,
        body: request.body,
      });

      const { output } = response;
      if (output) {
        reply.code(output.statusCode);

        if (output.headers) {
          reply.headers(output.headers);
        }

        if (output.body) {
          reply.send(output.body);
        }
      }
    } catch (e) {
      reply.code(500).send(e);
    }
  };
};
