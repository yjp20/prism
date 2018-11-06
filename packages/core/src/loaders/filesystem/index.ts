import { IFilesystemLoaderOpts } from '../../types';

const filesystemLoader = {
  load: async <Resource>(_opts?: IFilesystemLoaderOpts): Promise<Resource[]> => {
    // TODO: will use graph
    return [];
  },
};

export { filesystemLoader };
