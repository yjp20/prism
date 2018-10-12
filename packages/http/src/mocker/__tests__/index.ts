import { httpOperations } from '../../__tests__/fixtures';
import { mocker } from '../index';

// TODO: Turn examples into test cases -> https://stoplightio.atlassian.net/wiki/spaces/PN/pages/5996560/Prism+Feature+List+draft
describe('http mocker', () => {
  test.skip('should default to 2xx status code, first mediaType, and static example', async () => {
    const response = await mocker.mock({
      resource: httpOperations[0],
    });

    expect(response).toEqual({
      statusCode: 200,
      'content-type': 'application/json',
      body: {
        id: 1,
        completed: true,
        name: 'make prism',
      },
    });
  });

  test.skip('should support specifying a specific example', async () => {
    const response = await mocker.mock({
      resource: httpOperations[0],
      config: {
        mock: {
          example: 'bear',
        },
      },
    });

    expect(response).toEqual({
      statusCode: 200,
      'content-type': 'application/json',
      body: {
        id: 2,
        completed: false,
        name: 'make bears',
      },
    });
  });

  test.skip('should support dynamic response generation', async () => {
    const response = await mocker.mock({
      resource: httpOperations[1],
      config: {
        mock: {
          dynamic: true,
        },
      },
    });

    expect(response).toEqual({
      statusCode: 200,
      'content-type': 'application/json',

      // hmm.. will be dynamic - just check that it is here? or use ajv
      // here to validate the object against the schema in the mock?
      body: {
        id: 2,
        completed: false,
        name: 'make bears',
      },
    });
  });

  test.skip('should fallback to dynamic generation when example not found', async () => {
    // TODO
  });

  // ... more
});
