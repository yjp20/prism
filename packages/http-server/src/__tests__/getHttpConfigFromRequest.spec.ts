import { getHttpConfigFromRequest } from '../getHttpConfigFromRequest';

describe('getHttpConfigFromRequest()', () => {
  describe('given no default config', () => {
    test('and no query should return my own default', () => {
      return expect(
        getHttpConfigFromRequest({
          method: 'get',
          url: { path: '/' },
        })
      ).resolves.toMatchSnapshot();
    });
    test('and no matching query should return my own default', () => {
      return expect(
        getHttpConfigFromRequest({
          method: 'get',
          url: { path: '/', query: {} },
        })
      ).resolves.toMatchSnapshot();
    });
    test('extracts code', () => {
      return expect(
        getHttpConfigFromRequest({
          method: 'get',
          url: { path: '/', query: { __code: '202' } },
        })
      ).resolves.toMatchSnapshot();
    });
    test('extracts mediaType', () => {
      return expect(
        getHttpConfigFromRequest({
          method: 'get',
          url: { path: '/', query: { __contentType: 'application/json' } },
        })
      ).resolves.toMatchSnapshot();
    });
    test('extracts example', () => {
      return expect(
        getHttpConfigFromRequest({
          method: 'get',
          url: { path: '/', query: { __example: 'bear' } },
        })
      ).resolves.toMatchSnapshot();
    });
    test('extracts dynamic', () => {
      return expect(
        getHttpConfigFromRequest({
          method: 'get',
          url: { path: '/', query: { __dynamic: 'true' } },
        })
      ).resolves.toMatchSnapshot();
    });
  });

  describe('given default config function', () => {
    test('and that function returns a mock should combine with query params', () => {
      const spy = jest.fn().mockReturnValue({
        mock: {
          exampleKey: 'key',
        },
      });
      return expect(
        getHttpConfigFromRequest(
          {
            method: 'get',
            url: { path: '/', query: { __code: '400' } },
          },
          spy
        )
      ).resolves.toMatchSnapshot();
    });
  });

  describe('given default config object', () => {
    test('that is boolean and no matching query params should return that config object', () => {
      return expect(
        getHttpConfigFromRequest(
          {
            method: 'get',
            url: { path: '/', query: {} },
          },
          { mock: false }
        )
      ).resolves.toMatchSnapshot();
    });

    test('that is boolean and matching query should return that query', () => {
      return expect(
        getHttpConfigFromRequest(
          {
            method: 'get',
            url: { path: '/', query: { __code: '200', __example: 'bear' } },
          },
          { mock: false }
        )
      ).resolves.toMatchSnapshot();
    });

    test('that is a map and matching query should return combined', () => {
      return expect(
        getHttpConfigFromRequest(
          {
            method: 'get',
            url: { path: '/', query: { __code: '200', __example: 'bear' } },
          },
          {
            mock: {
              exampleKey: 'wolf',
              mediaType: 'plain/text',
            },
          }
        )
      ).resolves.toMatchSnapshot();
    });
  });
});
