import { Graph, INodeInstance } from '@stoplight/graph';
import {
  createFilesystemPlugin,
  FilesystemTypes,
  IDirectory,
  IDirectoryInput,
  IFile,
  IFileInput,
} from '@stoplight/graph/dist/plugins/filesystem';
import { createJsonPlugin } from '@stoplight/graph/dist/plugins/json';
import { NODE_TYPE as OAS2_HTTP_OPERATION } from '@stoplight/graph/dist/plugins/oas/http-operation/oas2/hooks/operation';
import { NODE_TYPE as OAS3_HTTP_OPERATION } from '@stoplight/graph/dist/plugins/oas/http-operation/oas3/hooks/operation';
import { createOas2Plugin } from '@stoplight/graph/dist/plugins/oas/oas2';
import { createOas3Plugin } from '@stoplight/graph/dist/plugins/oas/oas3';
import { createYamlPlugin } from '@stoplight/graph/dist/plugins/yaml';
import { IHttpOperation } from '@stoplight/types';
import * as fs from 'fs';
import compact = require('lodash/compact');

export class GraphFacade {
  private graph: Graph;

  constructor() {
    const graph = (this.graph = new Graph());
    // TODO(sl-732): we should probably export these as a collection of default plugins
    graph.addPlugin(createFilesystemPlugin());
    graph.addPlugin(createJsonPlugin());
    graph.addPlugin(createYamlPlugin());
    graph.addPlugin(createOas2Plugin());
    graph.addPlugin(createOas3Plugin());
  }

  public async createFilesystemNode(fsPath: string | undefined) {
    if (fsPath) {
      const stat = fs.lstatSync(fsPath);
      // TODO(SL-732): I feel like constructing this path is an implementation detail of how Graph works.
      // I would really appreciate if we had an abstraction for this.
      const path = `file://${fsPath}`;
      if (stat.isDirectory()) {
        return this.graph.createNode<IDirectoryInput, IDirectory>({
          type: FilesystemTypes.DIRECTORY,
          path,
          fsPath,
        });
      } else if (stat.isFile()) {
        return this.graph.createNode<IFileInput, IFile>({
          type: FilesystemTypes.FILE,
          path,
          fsPath,
        });
      }
    }
    return null;
  }

  get httpOperations(): IHttpOperation[] {
    const nodes = this.graph.nodes.filter(node =>
      [OAS2_HTTP_OPERATION, OAS3_HTTP_OPERATION].includes(node.type)
    ) as Array<INodeInstance<IHttpOperation>>;

    return compact(nodes.map(node => node.content));
  }
}
