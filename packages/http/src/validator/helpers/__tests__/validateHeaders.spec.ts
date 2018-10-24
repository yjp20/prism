import { validateHeaders } from '../validateHeaders';

describe('validateHeaders()', () => {
  describe('headers are missing', () => {
    it('returns empty validation error list', () => {
      expect(validateHeaders(undefined, [], 'application/json')).toEqual([]);
    });
  });

  describe('spec for headers is missing', () => {
    it('returns empty validation error list', () => {
      expect(validateHeaders({}, undefined, 'application/json')).toEqual([]);
    });
  });

  describe('spec is present', () => {
    describe('header is not present', () => {
      describe('spec defines it as required', () => {
        it('returns validation error', () => {
          expect(
            validateHeaders({}, [{ name: 'aHeader', required: true, content: {} }])
          ).toMatchSnapshot();
        });
      });
    });

    describe('header is present', () => {
      describe('schema is present', () => {
        describe('header is valid', () => {
          it('validates positively against schema', () => {
            expect(
              validateHeaders({ 'x-test-header': 'abc' }, [
                {
                  name: 'x-test-header',
                  content: { '*': { mediaType: '*', schema: { type: 'string' } } },
                },
              ])
            ).toEqual([]);
          });
        });

        describe('header is not valid', () => {
          it('not validates against schema', () => {
            expect(
              validateHeaders({ 'x-test-header': 'abc' }, [
                {
                  name: 'x-test-header',
                  content: { '*': { mediaType: '*', schema: { type: 'number' } } },
                },
              ])
            ).toMatchSnapshot();
          });
        });
      });

      describe('mediaType is provided', () => {
        describe('specific mediaType found in spec content list', () => {
          it('validates against more specific spec', () => {
            expect(
              validateHeaders(
                { 'x-test-header': 'abc' },
                [
                  {
                    name: 'x-test-header',
                    content: {
                      '*': { mediaType: '*', schema: { type: 'string' } },
                      'application/testson': {
                        mediaType: 'application/testson',
                        schema: { type: 'number' },
                      },
                    },
                  },
                ],
                'application/testson'
              )
            ).toMatchSnapshot();
          });
        });

        describe('specific mediaType not found in spec content list', () => {
          it('validates against default spec', () => {
            expect(
              validateHeaders(
                { 'x-test-header': 'abc' },
                [
                  {
                    name: 'x-test-header',
                    content: {
                      '*': { mediaType: '*', schema: { type: 'string' } },
                      'application/testson': {
                        mediaType: 'application/testson',
                        schema: { type: 'number' },
                      },
                    },
                  },
                ],
                'application/failson'
              )
            ).toMatchSnapshot();
          });
        });
      });

      describe('deprecated flag is set', () => {
        it('returns deprecation warning', () => {
          expect(
            validateHeaders({ 'x-test-header': 'abc' }, [
              {
                name: 'x-test-header',
                deprecated: true,
                content: {},
              },
            ])
          ).toMatchSnapshot();
        });
      });

      describe('explode flag is set', () => {
        describe('schema type is incorrect', () => {
          it('throws error', () => {
            expect(() =>
              validateHeaders({ 'x-test-header': 'abc' }, [
                {
                  name: 'x-test-header',
                  explode: true,
                  content: {
                    '*': { mediaType: '*', schema: { type: 'string' } },
                  },
                },
              ])
            ).toThrowErrorMatchingSnapshot();
          });
        });

        describe('header is valid', () => {
          it('validates positively', () => {
            expect(
              validateHeaders(
                {
                  'x-test-header-1': 'abc',
                  'x-test-header-2': 'def',
                },
                [
                  {
                    name: 'x-test-header',
                    explode: true,
                    content: {
                      '*': {
                        mediaType: '*',
                        schema: {
                          type: 'object',
                          properties: {
                            'x-test-header-1': { type: 'string' },
                            'x-test-header-2': { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                ]
              )
            ).toEqual([]);
          });
        });

        describe('header is invalid', () => {
          it('not validates', () => {
            expect(
              validateHeaders(
                {
                  'x-test-header-1': 'abc',
                  'x-test-header-2': 'def',
                },
                [
                  {
                    name: 'x-test-header',
                    explode: true,
                    content: {
                      '*': {
                        mediaType: '*',
                        schema: {
                          type: 'object',
                          properties: {
                            'x-test-header-1': { type: 'string' },
                            'x-test-header-2': { type: 'number' },
                          },
                        },
                      },
                    },
                  },
                ]
              )
            ).toMatchSnapshot();
          });
        });
      });
    });
  });
});
