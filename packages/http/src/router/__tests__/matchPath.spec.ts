import { Chance } from 'chance';
import { matchPath } from "@stoplight/prism-http/router/matchPath";
import { randomPath } from "@stoplight/prism-http/router/__tests__/utils";

const chance = new Chance();

describe('matchPath()', () => {

  test('request path must start with a slash or throw error', () => {
    const requestPath = randomPath({ leadingSlash: false });
    const operationPath = randomPath({ leadingSlash: true });
    expect(() => matchPath(requestPath, { path: operationPath })).toThrow('The request path must start with a slash.');
  });

  test('option path must start with a slash or throw error', () => {
    const requestPath = randomPath({ leadingSlash: true });
    const operationPath = randomPath({ leadingSlash: false });
    expect(() => matchPath(requestPath, { path: operationPath })).toThrow('The operation path must start with a slash.');
  });

  test('root path should match another root path', () => {
    const path = '/';
    expect(matchPath(path, { path })).toBeTruthy();
  });

  test('any concrete path should match an equal concrete path', () => {
    // e.g. /a/b/c should match /a/b/c
    const path = randomPath({
      pathFragments: chance.natural({ min: 1, max: 6 }),
      includeTemplates: false,
    });

    expect(matchPath(path, { path }).toBeTruthy();
  });

  test('any conrecte request path should match same length templated path', () => {
    // e.g. /a/b/c should match /a/{x}/c
    const pathFragments = chance.natural({ min: 1, max: 6 });
    const trailingSlash = chance.bool();
    const requestPath = randomPath({
      pathFragments,
      includeTemplates: false,
      trailingSlash
    });
    const operationPath = randomPath({
      pathFragments,
      includeTemplates: true,
      trailingSlash
    });

    expect(matchPath(requestPath, { path: operationPath })).toBeTruthy();
  });

  test('none request path should not match path with less fragments', () => {
    // e.g. /a/b/c should not match /a/b
    // e.g. /a/b/c should not match /{a}/b
    const trailingSlash = chance.bool();
    const requestPath = randomPath({
      pathFragments: chance.natural({ min: 4, max: 6 }),
      includeTemplates: false,
      trailingSlash,
    });
    const operationPath = randomPath({
      pathFragments: chance.natural({ min: 1, max: 3 }),
      trailingSlash,
    });

    expect(matchPath(requestPath, { path: operationPath })).toBeFalsy();
  });

  test('none request path should not match concrete path with more fragments', () => {
    // e.g. /a/b should not match /a/b/c
    // e.g. /a/b/ should not match /a/b/c
    const requestPath = randomPath({
      pathFragments: chance.natural({ min: 4, max: 6 }),
      includeTemplates: false,
    });
    const operationPath = randomPath({
      pathFragments: chance.natural({ min: 1, max: 3 }),
      includeTemplates: false,
    });

    expect(matchPath(requestPath, { path: operationPath })).toBeFalsy();
  });

  test('reqest path should match a templated path and resolve variables', () => {
    expect(matchPath('/a'), { '/{a}'}).toEqual([
      { name: 'a', value: 'a' }
    ]);

    expect(matchPath('/a/b'), { '/{a}/{b}'}).toEqual([
      { name: 'a', value: 'a' },
      { name: 'b', value: 'b' },
    ]);

    expect(matchPath('/a/b'), { '/a/{b}'}).toEqual([
      { name: 'b', value: 'b' },
    ]);
  });

  test('request path should match a template path and resolve undefined variables', () => {
    expect(matchPath('/'), { '/{a}'}).toEqual([
      { name: 'a', value: undefined },
    ]);

    expect(matchPath('//'), { '/{a}/'}).toEqual([
      { name: 'a', value: undefined },
    ]);

    expect(matchPath('//b'), { '/{a}/{b}'}).toEqual([
      { name: 'a', value: undefined },
      { name: 'b', value: 'b' },
    ]);

    expect(matchPath('/a/'), { '/{a}/{b}'}).toEqual([
      { name: 'a', value: 'a' },
      { name: 'b', value: undefined },
    ]);

    expect(matchPath('//'), { '/{a}/{b}'}).toEqual([
      { name: 'a', value: undefined },
      { name: 'b', value: undefined },
    ]);
  });

  test('none path should match templated operation with more path fragments', () => {
    // e.g. `/a/b` should not match /{x}/{y}/{z}
    // e.g. `/a` should not match /{x}/{y}/{z}
    const trailingSlash = chance.bool();
    const requestPath = randomPath({
      pathFragments: chance.natural({ min: 1, max: 3 }),
      includeTemplates: false,
      trailingSlash: false,
    });
    const operationPath = randomPath({
      pathFragments: chance.natural({ min: 4, max: 6 }),
      includeTemplates: false,
      trailingSlash: false,
    });

    expect(matchPath(requestPath, { path: operationPath })).toBeFalsy();
  });
});
