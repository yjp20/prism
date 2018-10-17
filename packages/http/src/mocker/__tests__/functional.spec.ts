import { JSONSchemaExampleGenerator } from '@stoplight/prism-http/mocker/generator/JSONSchemaExampleGenerator';
import * as Ajv from 'ajv';
import { httpOperations, httpRequests } from '../../__tests__/fixtures';
import { HttpMocker } from '../index';

// TODO: Turn examples into test cases -> https://stoplightio.atlassian.net/wiki/spaces/PN/pages/5996560/Prism+Feature+List+draft
describe('http mocker', () => {
  const mocker = new HttpMocker(new JSONSchemaExampleGenerator());

  test('should default to 2xx status code, first mediaType, and static example', async () => {
    const response = await mocker.mock({
      resource: httpOperations[0],
      input: httpRequests[0],
    });

    expect(response).toEqual({
      statusCode: 200,
      headers: {
        'Content-type': 'application/json',
      },
      body: [{ id: 1, completed: true, name: 'make prism' }],
    });
  });

  test('should support specifying a specific example', async () => {
    const response = await mocker.mock({
      resource: httpOperations[0],
      input: httpRequests[0],
      config: {
        mock: {
          exampleKey: 'bear',
        },
      },
    });

    expect(response).toEqual({
      statusCode: 200,
      headers: {
        'Content-type': 'application/json',
      },
      body: [{ id: 2, completed: false, name: 'make bears' }],
    });
  });

  test('should support dynamic response generation', async () => {
    if (!httpOperations[1].responses[0].content[0].schema) {
      throw new Error('Missing test');
    }

    const ajv = new Ajv();
    const validate = ajv.compile(httpOperations[1].responses[0].content[0].schema);

    const response = await mocker.mock({
      resource: httpOperations[1],
      input: httpRequests[0],
      config: {
        mock: {
          dynamic: true,
        },
      },
    });

    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toHaveProperty('headers', { 'Content-type': 'application/json' });
    expect(validate(JSON.parse(response.body))).toBe(true);
  });

  test.skip('should fallback to dynamic generation when example not found', async () => {
    // TODO
  });

  // ... more
});
