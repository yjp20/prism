import { Graph, INodeInstance } from '@stoplight/graph';
// TODO(sl-732): not sure that it's find to find these plugins
import {
  createFilesystemPlugin,
  FilesystemTypes,
  IDirectory,
  IDirectoryInput,
  IFile,
  IFileInput,
} from '@stoplight/graph/src/plugins/filesystem';
import { createJsonPlugin } from '@stoplight/graph/src/plugins/json';
import { NODE_TYPE as OAS2_HTTP_OPERATION } from '@stoplight/graph/src/plugins/oas/http-operation/oas2/hooks/operation';
import { NODE_TYPE as OAS3_HTTP_OPERATION } from '@stoplight/graph/src/plugins/oas/http-operation/oas3/hooks/operation';
import { createOas2Plugin } from '@stoplight/graph/src/plugins/oas/oas2';
import { createOas3Plugin } from '@stoplight/graph/src/plugins/oas/oas3';
import { createYamlPlugin } from '@stoplight/graph/src/plugins/yaml';
import { IHttpOperation } from '@stoplight/types';
import { promises as fs } from 'fs';
import compact = require('lodash/compact');
import { IFilesystemLoaderOpts } from '../../types';

const graph = new Graph();
// TODO(sl-732): we should probably export these as a collection of default plugins
graph.addPlugin(createFilesystemPlugin());
graph.addPlugin(createJsonPlugin());
graph.addPlugin(createYamlPlugin());
graph.addPlugin(createOas2Plugin());
graph.addPlugin(createOas3Plugin());

const filesystemLoader = {
  /**
   * TODO(sl-732): we can't assure we will return an array of 'Resource'.
   * There is no way to filter by a type in runtime :(
   */
  load: async (/*<Resource>*/ _opts?: IFilesystemLoaderOpts): Promise<IHttpOperation[]> => {
    const fsPath = _opts ? _opts.path : '';
    if (fsPath) {
      const stat = await fs.lstat(fsPath);
      const path = `file://${fsPath}`;
      if (stat.isDirectory()) {
        graph.createNode<IDirectoryInput, IDirectory>({
          type: FilesystemTypes.DIRECTORY,
          path,
          fsPath,
        });
      } else if (stat.isFile()) {
        graph.createNode<IFileInput, IFile>({
          type: FilesystemTypes.FILE,
          path,
          fsPath,
        });
      }
    }
    const nodes = graph.nodes.filter(node =>
      [OAS2_HTTP_OPERATION, OAS3_HTTP_OPERATION].includes(node.type)
    ) as Array<INodeInstance<IHttpOperation>>;

    return compact(nodes.map(node => node.content));
  },
};

export { filesystemLoader };
