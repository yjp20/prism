import { getHttpOperationsFromSpec } from '@stoplight/prism-cli/src/operations';
import { createClientFromOperations, PrismHttp } from '../client';
import * as pino from 'pino';

describe('Checks if memory leaks when handling of requests', () => {
  const SPEC = {
    openapi: '3.0.0',
    paths: {
      '/specific/echo/tests/{test_id}': {
        post: {
          summary: 'Echo',
          description: 'Cf. summary',
          parameters: [
            {
              name: 'authorization',
              description: 'Bearer token.',
              in: 'header',
              required: true,
              schema: {
                type: 'string',
                maxLength: 4000,
              },
            },
            {
              name: 'x-environment',
              in: 'header',
              description: 'Header x-environment',
              schema: {
                type: 'string',
                enum: ['test', 'prod'],
              },
            },
            {
              name: 'complete',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['false', 'no'],
              },
            },
            {
              name: 'x-tenant-id',
              description: 'The unique identifier of the tenant',
              in: 'header',
              required: true,
              schema: {
                type: 'string',
                maxLength: 50,
              },
            },
            {
              name: 'test_id',
              description: 'Identifier of the test',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                maxLength: 150,
              },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Your request back.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                  },
                },
              },
            },
            '400': {
              description: 'Bad Request.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      error: {
                        type: 'string',
                        maxLength: 50,
                      },
                      error_description: {
                        type: 'string',
                        maxLength: 4000,
                      },
                      status_code: {
                        type: 'string',
                        maxLength: 3,
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized (JWT not valid).',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      error: {
                        type: 'string',
                        maxLength: 50,
                      },
                      error_description: {
                        type: 'string',
                        maxLength: 4000,
                      },
                      status_code: {
                        type: 'string',
                        maxLength: 3,
                      },
                    },
                  },
                },
              },
            },
            '403': {
              description: "Forbidden (doesn't have the valid scope).",
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      error: {
                        type: 'string',
                        maxLength: 50,
                      },
                      error_description: {
                        type: 'string',
                        maxLength: 4000,
                      },
                      status_code: {
                        type: 'string',
                        maxLength: 3,
                      },
                    },
                  },
                },
              },
            },
            '404': {
              description: 'Not Found (Resource not found).',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      error: {
                        type: 'string',
                        maxLength: 50,
                      },
                      error_description: {
                        type: 'string',
                        maxLength: 4000,
                      },
                      status_code: {
                        type: 'string',
                        maxLength: 3,
                      },
                    },
                  },
                },
              },
            },
            default: {
              description: 'Default response format.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      error: {
                        type: 'string',
                        maxLength: 50,
                      },
                      error_description: {
                        type: 'string',
                        maxLength: 4000,
                      },
                      status_code: {
                        type: 'string',
                        maxLength: 3,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  function round(client: PrismHttp) {
    return client.post('/specific/echo/tests/something?complete=true', '1', { headers: { 'x-tenant-id': 'north-eu' } });
  }

  it('10k', async () => {
    const operations = await getHttpOperationsFromSpec(SPEC);

    const logger = pino({});
    // creates special instance of pino logger that prevent collecting or logging anything
    // Unfortunately disabled logger didn't work
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = () => {};
    logger.info = noop;
    logger.success = noop;
    logger.error = noop;
    logger.warn = noop;
    logger.child = () => logger;

    const client = createClientFromOperations(operations, {
      validateRequest: true,
      validateResponse: true,
      checkSecurity: true,
      errors: true,
      mock: {
        dynamic: true,
      },
      logger,
    });

    round(client);
    const baseMemoryUsage = process.memoryUsage().heapUsed;
    for (let i = 0; i < 5000; i++) {
      round(client);
      if (i % 1000 === 0) {
        global.gc();
      }
    }

    global.gc();
    expect(process.memoryUsage().heapUsed).toBeLessThanOrEqual(baseMemoryUsage);
  });
});
