import { createInstance, IHttpMethod } from '@stoplight/prism-http';
import { TPrismHttpInstance } from '@stoplight/prism-http/types';
import * as fastify from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

import { getHttpConfigFromRequest } from './getHttpConfigFromRequest';
import { IPrismHttpServer, IPrismHttpServerOpts } from './types';

export const createServer = async <LoaderInput>(
  loaderInput: LoaderInput,
  opts: IPrismHttpServerOpts<LoaderInput>
): Promise<IPrismHttpServer<LoaderInput>> => {
  const server = fastify<Server, IncomingMessage, ServerResponse>();

  const { components } = opts;
  const prism = createInstance<LoaderInput>({
    config: getHttpConfigFromRequest,
    ...components,
  });

  await prism.load(loaderInput);
  server.all('*', {}, replyHandler<LoaderInput>(prism));

  const prismServer: IPrismHttpServer<LoaderInput> = {
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

const replyHandler = <LoaderInput>(
  prism: TPrismHttpInstance<LoaderInput>
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
