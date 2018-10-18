import { IHttpOperation, IServer } from '@stoplight/types';
import { Chance } from 'chance';
import { router } from '../index';
import { pickOneHttpMethod, pickSetOfHttpMethods, randomPath } from './utils';

const chance = new Chance();

function createResource(method: string, path: string, servers: IServer[] = []): IHttpOperation {
  return {
    id: chance.guid(),
    method,
    path,
    responses: [],
    servers,
  };
}

describe('http router', () => {
  describe('route()', () => {
    test('should return null if no resources given', async () => {
      const resource = await router.route({
        resources: [],
        input: {
          method: pickOneHttpMethod(),
          url: {
            baseUrl: '',
            path: '',
          },
        },
      });

      expect(resource).toBeNull();
    });

    describe('given a resource', () => {
      test('should not match if no server defined', async () => {
        const resource = await router.route({
          resources: [createResource(pickOneHttpMethod(), randomPath())],
          input: {
            method: pickOneHttpMethod(),
            url: {
              baseUrl: '',
              path: '',
            },
          },
        });

        expect(resource).toBeNull();
      });

      test('given a concrete matching server and unmatched methods should not match', async () => {
        const url = chance.url();
        const [resourceMethod, requestMethod] = pickSetOfHttpMethods(2);
        const resource = await router.route({
          resources: [
            createResource(resourceMethod, randomPath(), [
              {
                url,
              },
            ]),
          ],
          input: {
            method: requestMethod,
            url: {
              baseUrl: url,
              path: '/',
            },
          },
        });

        expect(resource).toBeNull();
      });

      describe('given matched methods', () => {
        const method = pickOneHttpMethod();

        test('given a concrete matching server unmatched path should not match', async () => {
          const url = chance.url();
          const path = randomPath({ trailingSlash: false });
          const resource = await router.route({
            resources: [
              createResource(method, path, [
                {
                  url,
                },
              ]),
            ],
            input: {
              method,
              url: {
                baseUrl: url,
                path: `${path}${randomPath()}`,
              },
            },
          });

          expect(resource).toBeNull();
        });

        test('given a concrete matching server and matched concrete path should match', async () => {
          const url = chance.url();
          const path = randomPath({ includeTemplates: false });
          const expectedResource = createResource(method, path, [
            {
              url,
            },
          ]);
          const resource = await router.route({
            resources: [expectedResource],
            input: {
              method,
              url: {
                baseUrl: url,
                path,
              },
            },
          });

          expect(resource).toBe(expectedResource);
        });

        test('given a concrete matching server and matched templated path should match', async () => {
          const url = chance.url();
          const templatedPath = '/a/{b}/c';
          const requestPath = '/a/x/c';
          const expectedResource = createResource(method, templatedPath, [
            {
              url,
            },
          ]);
          const resource = await router.route({
            resources: [expectedResource],
            input: {
              method,
              url: {
                baseUrl: url,
                path: requestPath,
              },
            },
          });

          expect(resource).toBe(expectedResource);
        });

        test('given a concrete matching server and unmatched templated path should not match', async () => {
          const url = chance.url();
          const templatedPath = '/a/{x}/c';
          const requestPath = '/a/y/b';
          const expectedResource = createResource(method, templatedPath, [
            {
              url,
            },
          ]);
          const resource = await router.route({
            resources: [expectedResource],
            input: {
              method,
              url: {
                baseUrl: url,
                path: requestPath,
              },
            },
          });

          expect(resource).toBeNull();
        });

        test('given a concrete servers and mixed paths should match concrete path', async () => {
          const templatedPath = '/{x}/y';
          const concretePath = '/a/y';
          const url = 'concrete.com';
          const resourceWithConcretePath = createResource(method, concretePath, [{ url }]);
          const resourceWithTemplatedPath = createResource(method, templatedPath, [{ url }]);
          const resource = await router.route({
            resources: [resourceWithTemplatedPath, resourceWithConcretePath],
            input: {
              method,
              url: {
                baseUrl: url,
                path: concretePath,
              },
            },
          });

          expect(resource).toBe(resourceWithConcretePath);
        });

        test('given a concrete servers and templated paths should match first resource', async () => {
          const templatedPathA = '/{x}/y';
          const templatedPathB = '/a/{z}';
          const url = 'concrete.com';
          const firstResource = createResource(method, templatedPathA, [{ url }]);
          const secondResource = createResource(method, templatedPathB, [{ url }]);
          const resource = await router.route({
            resources: [firstResource, secondResource],
            input: {
              method,
              url: {
                baseUrl: url,
                path: '/a/y',
              },
            },
          });

          expect(resource).toBe(firstResource);
        });

        test('given a concrete server and templated server should match concrete', async () => {
          const path = '/';
          const url = 'concrete.com';
          const resourceWithConcreteMatch = createResource(method, path, [
            { url },
            { url: '{template}', variables: { template: { default: url, enum: [url] } } },
          ]);
          const resourceWithTemplatedMatch = createResource(method, path, [
            { url: '{template}', variables: { template: { default: url, enum: [url] } } },
          ]);
          const resource = await router.route({
            resources: [resourceWithConcreteMatch, resourceWithTemplatedMatch],
            input: {
              method,
              url: {
                baseUrl: url,
                path,
              },
            },
          });

          expect(resource).toBe(resourceWithConcreteMatch);
        });

        test('given concret servers should match by path', async () => {
          const matchingPath = '/a/b/c';
          const nonMatchingPath = '/a/b/c/d';
          const url = 'concrete.com';
          const resourceWithMatchingPath = createResource(method, matchingPath, [{ url }]);
          const resourceWithNonMatchingPath = createResource(method, nonMatchingPath, [{ url }]);
          const resource = await router.route({
            resources: [resourceWithNonMatchingPath, resourceWithMatchingPath],
            input: {
              method,
              url: {
                baseUrl: url,
                path: matchingPath,
              },
            },
          });

          expect(resource).toBe(resourceWithMatchingPath);
        });

        test('given empty baseUrl and concrete server it should not match', async () => {
          const path = randomPath({ includeTemplates: false });
          const url = 'concrete.com';
          const resource = await router.route({
            resources: [createResource(method, path, [{ url }])],
            input: {
              method,
              url: {
                baseUrl: '',
                path,
              },
            },
          });

          expect(resource).toBeNull();
        });

        test('given empty baseUrl and empty server url it should match', async () => {
          const path = randomPath({ includeTemplates: false });
          const url = '';
          const expectedResource = createResource(method, path, [{ url }]);
          const resource = await router.route({
            resources: [expectedResource],
            input: {
              method,
              url: {
                baseUrl: '',
                path,
              },
            },
          });

          expect(resource).toBe(expectedResource);
        });
      });
    });
  });
});
