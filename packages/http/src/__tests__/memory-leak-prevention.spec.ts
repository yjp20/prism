import { createClientFromOperations, PrismHttp } from '../client';
import { httpOperations } from './fixtures';
import { createTestLogger } from './test-helpers';

describe('Checks if memory leaks when handling of requests', () => {
  function round(client: PrismHttp) {
    return client.post(
      '/todos?overwrite=yes',
      {
        name: 'some name',
        completed: false,
      },
      { headers: { 'x-todos-publish': '2021-09-21T09:48:48.108Z' } }
    );
  }

  it('5k', () => {
    const logger = createTestLogger();
    const client = createClientFromOperations(httpOperations, {
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
    let minMemoryUsage = Infinity;
    for (let i = 0; i < 5000; i++) {
      round(client);
      if (i % 100 === 0) {
        global.gc();
        minMemoryUsage = Math.min(baseMemoryUsage, process.memoryUsage().heapUsed);
      }
    }
    expect(minMemoryUsage).toBeLessThanOrEqual(baseMemoryUsage);
  });
});
