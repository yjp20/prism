import { IFilesystemLoaderOpts } from '@stoplight/prism-core';
import { TPrismHttpComponents, TPrismHttpInstance } from '@stoplight/prism-http';
import { FastifyInstance, ServerOptions } from 'fastify';

export interface IPrismHttpServerOpts {
  loaderOpts?: IFilesystemLoaderOpts;
  fastify?: ServerOptions;
  components?: TPrismHttpComponents;
}

export interface IPrismHttpServer {
  readonly prism: TPrismHttpInstance;
  readonly fastify: FastifyInstance;
  listen: ListenFunc;
}

export type ListenFunc = (port: number, address?: string, backlog?: number) => Promise<string>;
