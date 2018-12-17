import { IHttpOperation } from '@stoplight/types';
import { IFilesystemLoaderOpts } from '../../types';
import { GraphFacade } from '../../utils/graphFacade';

let graphFacade: GraphFacade;

const filesystemLoader = {
  /**
   * TODO(sl-732): we can't assure we will return an array of 'Resource'.
   * There is no way to filter by a type in runtime :(
   */
  load: async (/*<Resource>*/ _opts?: IFilesystemLoaderOpts): Promise<IHttpOperation[]> => {
    const fsPath = _opts ? _opts.path : '';
    graphFacade = graphFacade || new GraphFacade();
    await graphFacade.createFilesystemNode(fsPath);
    return graphFacade.httpOperations;
  },
};

export { filesystemLoader };
