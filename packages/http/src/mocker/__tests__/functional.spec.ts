import { ISchema } from '@stoplight/types/schema';
import * as Ajv from 'ajv';

import { httpOperations, httpRequests } from '../../__tests__/fixtures';
import { JSONSchemaExampleGenerator } from '../generator/JSONSchemaExampleGenerator';
import { HttpMocker } from '../index';

// TODO: Turn examples into test cases -> https://stoplightio.atlassian.net/wiki/spaces/PN/pages/5996560/Prism+Feature+List+draft
describe('http mocker', () => {
  const mocker = new HttpMocker(new JSONSchemaExampleGenerator());

  describe('request is valid', () => {
    describe('HttpOperation contains example', () => {
      test('return lowest 2xx code and match response example to media type accepted by request', async () => {
        const response = await mocker.mock({
          resource: httpOperations[0],
          input: httpRequests[0],
        });

        expect(response).toMatchSnapshot();
      });

      test('return lowest 2xx response and the first example matching the media type', async () => {
        const response = await mocker.mock({
          resource: httpOperations[1],
          input: Object.assign({}, httpRequests[0], {
            data: Object.assign({}, httpRequests[0].data, {
              headers: { 'Content-type': 'application/xml' },
            }),
          }),
        });

        expect(response).toMatchSnapshot();
      });

      describe('the media type requested does not match the example', () => {
        test('return lowest 2xx, first example and matching media type', async () => {
          const response = await mocker.mock({
            resource: httpOperations[0],
            input: Object.assign({}, httpRequests[0], {
              data: Object.assign({}, httpRequests[0].data, {
                headers: { 'Content-type': 'application/xml' },
              }),
            }),
          });

          expect(response).toMatchSnapshot();
        });
      });
    });

    describe('HTTPOperation contain no examples', () => {
      test('return dynamic response', async () => {
        if (!httpOperations[1].responses[0].contents[0].schema) {
          throw new Error('Missing test');
        }

        const ajv = new Ajv();
        const validate = ajv.compile(httpOperations[1].responses[0].contents[0].schema as ISchema);

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
    });
  });

  describe('request is invalid', () => {
    test('returns 400 and static error response', async () => {
      const response = await mocker.mock({
        resource: httpOperations[0],
        input: httpRequests[1],
      });

      expect(response).toMatchSnapshot();
    });

    test('returns 400 and dynamic error response', async () => {
      if (!httpOperations[1].responses[1].contents[0].schema) {
        throw new Error('Missing test');
      }

      const response = await mocker.mock({
        resource: httpOperations[1],
        input: httpRequests[1],
      });

      const ajv = new Ajv();
      const validate = ajv.compile(httpOperations[1].responses[1].contents[0].schema as ISchema);

      expect(validate(JSON.parse(response.body))).toBe(true);
    });
  });
});
