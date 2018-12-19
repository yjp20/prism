jest.mock('@stoplight/graph');
import { Graph } from '@stoplight/graph';
import { NODE_TYPE as OAS2_HTTP_OPERATION } from '@stoplight/graph/dist/plugins/oas/http-operation/oas2/hooks/operation';
import { NODE_TYPE as OAS3_HTTP_OPERATION } from '@stoplight/graph/dist/plugins/oas/http-operation/oas3/hooks/operation';

import { GraphFacade } from '../../utils/graphFacade';

describe('graphFacade', () => {
  const graph = new Graph();
  const graphFacade = new GraphFacade(graph);

  test('httpOperations should return filtered nodes', () => {
    const nodes: any = [
      {
        type: OAS2_HTTP_OPERATION,
        content: {
          id: 'abc-oas2',
        },
      },
      {
        type: OAS3_HTTP_OPERATION,
        content: {
          id: 'abc-oas3',
        },
      },
      {
        type: 'wubadub',
        content: {
          id: 'abc-omg',
        },
      },
    ];

    // @ts-ignore
    graph.nodes = nodes;

    expect(graphFacade.httpOperations).toEqual([
      {
        id: 'abc-oas2',
      },
      {
        id: 'abc-oas311',
      },
    ]);
  });
});
