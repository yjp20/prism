import { GraphFacade } from '../graphFacade';

describe('graphFacade', () => {
  const graphFacade = new GraphFacade();

  test('httpOperations should return filtered nodes', async () => {
    await graphFacade.createFilesystemNode('packages/cli/src/samples/no-refs-petstore.oas2.json');

    expect(graphFacade.httpOperations).toMatchSnapshot();
  });
});
