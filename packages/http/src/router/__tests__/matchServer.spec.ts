import { convertTemplateToRegExp, matchServer } from "../matchServer";

describe('matchServer.ts', () => {
  describe.only('matchServer()', () => {
    test('concrete server url fully matches request url', () => {
      const serverMatch = matchServer({
        url: 'http://www.example.com/'
      }, new URL('http://www.example.com/'));

      expect(serverMatch).toEqual({
        baseUrl: 'http://www.example.com/',
        path: ''
      });
    });

    test('concrete server url partially matches request url', () => {
      expect(matchServer(
        { url: 'http://www.example.com' },
        new URL('http://www.example.com/')
      )).toEqual({
        baseUrl: 'http://www.example.com',
        path: '/'
      });

      expect(matchServer(
        { url: 'http://www.example.com' },
        new URL('http://www.example.com/path')
      )).toEqual({
        baseUrl: 'http://www.example.com',
        path: '/path'
      });

      expect(matchServer(
        { url: 'http://www.example.com' },
        new URL('http://www.example.com/path/path?a=v&b=v#fragment')
      )).toEqual({
        baseUrl: 'http://www.example.com',
        path: '/path/path'
      });
    });

    test('concrete server url does not match request url', () => {
      expect(matchServer(
        { url: 'http://www.example.com' },
        new URL('http://www.google.com/')
      )).toBeNull();

      expect(matchServer(
        { url: 'http://www.example.com/v1' },
        new URL('http://www.example.com/')
      )).toBeNull();

      expect(matchServer(
        { url: 'http://www.example.com/v1' },
        new URL('http://www.example.com/v2')
      )).toBeNull();

      expect(matchServer(
        { url: 'https://www.example.com/v1' },
        new URL('http://www.example.com/v1')
      )).toBeNull();

      expect(matchServer(
        { url: 'http://www.example.com:8081/v1' },
        new URL('http://www.example.com/v1')
      )).toBeNull();
    });

    test('entirely templated server url enum to match request', () => {
      const serverConfig = {
        url: '{url}',
        variables: {
          url: {
            default: 'http://www.example.com',
            enum: [
              'http://www.example.com',
              'http://www.example.com:8080',
            ]
          }
        }
      };

      expect(matchServer(
        serverConfig,
        new URL('http://www.example.com/v1/path')
      )).toEqual({
        baseUrl: 'http://www.example.com',
        path: '/v1/path'
      });

      expect(matchServer(
        serverConfig,
        new URL('http://www.example.com:8080/v1/path')
      )).toEqual({
        baseUrl: 'http://www.example.com:8080',
        path: '/v1/path'
      });

      expect(matchServer(
        serverConfig,
        new URL('https://www.example.com/v1/path')
      )).toBeNull();
    });

    test('server url with templated wildcard host to match request url', () => {
      expect(matchServer(
        {
          url: 'http://{host}/v1',
          variables: {
            host: { default: 'www.example.com' }
          }
        },
        new URL('http://stoplight.io/v1/path')
      )).toEqual({
        baseUrl: 'http://stoplight.io/v1',
        path: '/path'
      });
    });

    test('server url with templated enum host to match request url', () => {
      const serverConfig = {
        url: 'http://{host}/v1',
        variables: {
          host: {
            default: 'www.example.com',
            enum: [
              'stoplight.io',
              'google.io',
            ]
          }
        }
      };

      expect(matchServer(
        serverConfig,
        new URL('http://stoplight.io/v1/path')
      )).toEqual({
        baseUrl: 'http://stoplight.io/v1',
        path: '/path'
      });

      expect(matchServer(
        serverConfig,
        new URL('http://google.io/v1/path')
      )).toEqual({
        baseUrl: 'http://google.io/v1',
        path: '/path'
      });
    });

    test('server url with templated enum host not to match request url', () => {
      const serverConfig = {
        url: 'http://{host}/v1',
        variables: {
          host: {
            default: 'stoplight.io',
            enum: [
              'stoplight.io',
              'google.io',
            ]
          }
        }
      };

      expect(matchServer(
        serverConfig,
        new URL('http://bummers.io/v1/path')
      )).toBeNull();
    });

    describe('a fully templated server url', () => {
      const serverConfig = {
        url: '{url}{path}',
        variables: {
          url: {
            default: 'http://stoplight.io',
            enum: [
              'http://stoplight.io',
              'http://stoplight.io:8080',
              'http://stoplight.io:808',
            ]
          },
          path: {
            default: '/v1',
            enum: [ '/v1', '/v2' ]
          }
        }
      };

      test('should match enums', () => {
        expect(matchServer(
          serverConfig,
          new URL('http://stoplight.io/path')
        )).toEqual({
          baseUrl: 'http://stoplight.io',
          path: '/path'
        });

        expect(matchServer(
          serverConfig,
          new URL('http://stoplight.io:8080/path')
        )).toEqual({
          baseUrl: 'http://stoplight.io:8080',
          path: '/path'
        });

        expect(matchServer(
          serverConfig,
          new URL('http://stoplight.io:808/path')
        )).toEqual({
          baseUrl: 'http://stoplight.io:808',
          path: '/path'
        });
      });
      // 'http://stoplight.io',
      // 'http://stoplight.io:8080',
      // 'http://stoplight.io:808',
      test('known issue one', () => {
        expect(matchServer(
          serverConfig,
          new URL('http://stoplight.io:80/path')
        )).toBeNull();
      });

      test('known issue two', () => {
        expect(matchServer(
          serverConfig,
          new URL('http://stoplight.io:801/path')
        )).toBeNull();
      });
    });
  });

  describe('convertTemplateToRegExp()', () => {
    test('given no variables should resolve to the original string', () => {
      const regexp = convertTemplateToRegExp('{a}');
      expect(regexp).toEqual(/{a}/);
    });

    test('given no a variable with enums should alternate these enums', () => {
      const regexp = convertTemplateToRegExp('{a}', {
        a: {
          default: 'z',
          enum: ['y', 'z']
        }
      });
      expect(regexp).toEqual(/(y|z)/);
    });

    test('single variable should resolve a single group regexp', () => {
      const regexp = convertTemplateToRegExp('{a}', {
        'a': {
          default: 'va'
        }
      });

      expect(regexp).toEqual(/(.*?)/);
    });

    test('given single variable and no matching variable should throw', () => {
      expect(() => convertTemplateToRegExp('{a}', {
        'b': {
          default: 'vb'
        }
      })).toThrow(`Variable 'a' is not defined, cannot parse input.`);
    });

    test('given two variables should return multi group', () => {
      const regexp = convertTemplateToRegExp('{a}{b}', {
        'a': {
          default: 'va'
        },
        'b': {
          default: 'vb2',
          enum: ['vb2']
        }
      });

      expect(regexp).toEqual(/(.*?)(vb2)/);
    });

    test('given a URL should return a pattern', () => {
      const regexp = convertTemplateToRegExp('{protocol}://www.example.com:{port}/{path}', {
        'protocol': {
          default: 'http',
          enum: ['http', 'https']
        },
        'port': {
          default: '8080'
        },
        'path': {
          default: 'v1',
          enum: ['v1', 'v2']
        }
      });

      expect(regexp).toEqual(/(https|http):\/\/www.example.com:(.*?)\/(v1|v2)/);
    });

    test('given a similar enums should put longer ones first', () => {
      const regexp = convertTemplateToRegExp('{url}', {
        'url': {
          default: 'http://example.com',
          enum: ['http://example.com', 'http://example.com:8080']
        }
      });

      expect(regexp).toEqual(/(http:\/\/example.com:8080|http:\/\/example.com)/);
    });
  });
});
