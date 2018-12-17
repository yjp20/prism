import { IPrism } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types/http-spec';
import { omit } from 'lodash';
import { resolve } from 'path';
import { createInstance, IHttpConfig, IHttpRequest, IHttpResponse } from '../';

describe('Http Prism Instance function tests', () => {
  let prism: IPrism<IHttpOperation, IHttpRequest, IHttpResponse, IHttpConfig, { path: string }>;

  beforeAll(async () => {
    prism = createInstance();
    await prism.load({
      path: resolve(__dirname, 'fixtures', 'no-refs-petstore-minimal.oas2.json'),
    });
  });

  test('given incorrect route should throw error', () => {
    return expect(
      prism.process({
        method: 'get',
        url: {
          path: '/invalid-route',
        },
      })
    ).rejects.toThrowError('Route not resolved, none path matched');
  });

  test('given correct route should return correct response', async () => {
    const response = await prism.process({
      method: 'get',
      url: {
        path: '/pet/findByStatus',
        query: {
          status: ['available', 'pending'],
        },
      },
    });
    const parsedBody = JSON.parse(response!.output!.body);
    expect(parsedBody.length).toBeGreaterThan(0);
    parsedBody.forEach((element: any) => {
      expect(typeof element.name).toEqual('string');
      expect(Array.isArray(element.photoUrls)).toBeTruthy();
      expect(element.photoUrls.length).toBeGreaterThan(0);
    });
    // because body is generated randomly
    expect(omit(response, 'output.body')).toMatchSnapshot();
  });

  test('given route with invalid param should return a validation error', async () => {
    const response = await prism.process({
      method: 'get',
      url: {
        path: '/pet/findByStatus',
      },
    });
    expect(response).toMatchSnapshot();
  });
});
