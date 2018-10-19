import { IHttpRequest } from '@stoplight/prism-http';
import { getHttpConfigFromRequest } from '../getHttpConfigFromRequest';

describe('getHttpConfigFromRequest()', () => {
  test('extracts code', () => {
    return expect(
      getHttpConfigFromRequest({
        method: 'get',
        url: { path: '/', query: { __code: '202' } },
      } as IHttpRequest)
    ).resolves.toMatchSnapshot();
  });
  test('extracts mediaType', () => {
    return expect(
      getHttpConfigFromRequest({
        method: 'get',
        url: { path: '/', query: { __contentType: 'application/json' } },
      } as IHttpRequest)
    ).resolves.toMatchSnapshot();
  });
  test('extracts example', () => {
    return expect(
      getHttpConfigFromRequest({
        method: 'get',
        url: { path: '/', query: { __example: 'bear' } },
      } as IHttpRequest)
    ).resolves.toMatchSnapshot();
  });
  test('extracts dynamic', () => {
    return expect(
      getHttpConfigFromRequest({
        method: 'get',
        url: { path: '/', query: { __dynamic: 'true' } },
      } as IHttpRequest)
    ).resolves.toMatchSnapshot();
  });
});
