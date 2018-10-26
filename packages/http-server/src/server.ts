import { configMergerFactory } from '@stoplight/prism-core';
import { createInstance, IHttpMethod, TPrismHttpInstance } from '@stoplight/prism-http';
import * as fastify from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

import { getHttpConfigFromRequest } from './getHttpConfigFromRequest';
import { IPrismHttpServer, IPrismHttpServerOpts } from './types';

export const createServer = <LoaderInput>(
  loaderInput: LoaderInput,
  opts: IPrismHttpServerOpts<LoaderInput>
): IPrismHttpServer<LoaderInput> => {
  const server = fastify<Server, IncomingMessage, ServerResponse>();
  const { components = {} } = opts;
  const config = configMergerFactory(components.config, getHttpConfigFromRequest);

  const prism = createInstance<LoaderInput>({
    ...components,
    config,
  });

  server.all('*', {}, replyHandler<LoaderInput>(prism));

  const prismServer: IPrismHttpServer<LoaderInput> = {
    get prism() {
      return prism;
    },

    get fastify() {
      return server;
    },

    listen: async (port: number, ...args: any[]) => {
      try {
        await prism.load(loaderInput);
      } catch (e) {
        console.error('Error loading data into prism.', e);
        throw e;
      }

      return server.listen(port, ...args);
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
