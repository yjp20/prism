import { TPrismHttpComponents, TPrismHttpInstance } from '@stoplight/prism-http';
import { FastifyInstance, ServerOptions } from 'fastify';

export interface IPrismHttpServerOpts<LoaderInput> {
  fastify?: ServerOptions;
  components?: TPrismHttpComponents<LoaderInput>;
}

export interface IPrismHttpServer<LoaderInput> {
  readonly prism: TPrismHttpInstance<LoaderInput>;
  readonly fastify: FastifyInstance;
  listen: ListenFunc;
}

export type ListenFunc = (port: number, address?: string, backlog?: number) => Promise<string>;
