import { Chance } from 'chance';
import { router } from '../index';
import { oneRandomHttpMethod, randomUrl, randomPath, pickSetOfHttpMethods, pickOneHttpMethod } from '@stoplight/prism-http/router/__tests__/utils';

const chance = new Chance();

describe('http router', () => {
  describe.skip('route()', () => {
    test('should return null if no resources given', async () => {
      const resource = await router.route({
        resources: [],
        input: {
          method: oneRandomHttpMethod(),
          url: randomUrl()
        }
      });

      expect(resource).toBeNull();
    });

    describe('given a resource', () => {
      test('should not match if no server defined', async () => {
        const resource = await router.route({
          resources: [{
            id: chance.guid(),
            method: oneRandomHttpMethod(),
            path: randomPath(),
            responses: [],
            servers: []
          }],
          input: {
            method: oneRandomHttpMethod(),
            url: randomUrl()
          }
        });

        expect(resource).toBeNull();
      });

      test('given a concrete matching server and unmatched methods should not match', async () => {
        const url = randomUrl();
        const [ resourceMethod, requestMethod ] = pickSetOfHttpMethods(2);
        const resource = await router.route({
          resources: [{
            id: chance.guid(),
            method: resourceMethod,
            path: randomPath(),
            responses: [],
            servers: [{
              url: url.toString(),
            }]
          }],
          input: {
            method: requestMethod,
            url
          }
        });

        expect(resource).toBeNull();
      });

      test('given a concrete matching server and matched methods and unmatched path should not match', async () => {
        const url = randomUrl();
        const method = pickOneHttpMethod();
        const resource = await router.route({
          resources: [{
            id: chance.guid(),
            method,
            path: randomPath(),
            responses: [],
            servers: [{
              url: url.toString(),
            }]
          }],
          input: {
            method,
            url
          }
        });

        expect(resource).toBeNull();
      });
    });
  });
});
