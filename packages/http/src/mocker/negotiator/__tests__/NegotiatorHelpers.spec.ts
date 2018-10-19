import { IExample, IHttpContent, IHttpOperation, IHttpResponse } from '@stoplight/types';
import { Chance } from 'chance';

import helpers from '../NegotiatorHelpers';

const chance = new Chance();

function anHttpOperation(givenHttpOperation?: IHttpOperation) {
  const httpOperation = givenHttpOperation || {
    method: chance.string(),
    path: chance.url(),
    responses: [],
    id: chance.string(),
  };
  return {
    instance() {
      return httpOperation;
    },
    withResponses(responses: IHttpResponse[]) {
      httpOperation.responses = responses;
      return this;
    },
  };
}

describe('NegotiatorHelpers', () => {
  let httpOperation: IHttpOperation;

  beforeEach(() => {
    httpOperation = anHttpOperation().instance();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('negotiateOptionsForInvalidRequest()', () => {
    describe('and 400 response exists', () => {
      const actualCode = '400';
      const actualMediaType = chance.string();
      const actualExampleKey = chance.string();

      test('and has static examples defined should return the first static example', () => {
        httpOperation = anHttpOperation(httpOperation)
          .withResponses([
            {
              code: actualCode,
              content: [
                {
                  mediaType: actualMediaType,
                  examples: [{ key: actualExampleKey }, { key: chance.string() }],
                },
              ],
            },
          ])
          .instance();

        const actualConfig = helpers.negotiateOptionsForInvalidRequest(httpOperation.responses);
        const expectedConfig = {
          code: actualCode,
          mediaType: actualMediaType,
          example: { key: actualExampleKey },
        };

        expect(actualConfig).toEqual(expectedConfig);
      });

      describe('and has no static content', () => {
        test('and has schemable content should return first such content', () => {
          httpOperation = anHttpOperation(httpOperation)
            .withResponses([
              {
                code: actualCode,
                content: [
                  {
                    mediaType: actualMediaType + chance.character(),
                    examples: [],
                  },
                  {
                    schema: { type: 'type1' },
                    mediaType: actualMediaType,
                    examples: [],
                  },
                  {
                    schema: { type: 'type2' },
                    mediaType: actualMediaType + chance.character(),
                    examples: [],
                  },
                ],
              },
            ])
            .instance();

          const actualConfig = helpers.negotiateOptionsForInvalidRequest(httpOperation.responses);
          const expectedConfig = {
            code: actualCode,
            mediaType: actualMediaType,
            schema: { type: 'type1' },
          };

          expect(actualConfig).toEqual(expectedConfig);
        });

        test('and no schemable content should return error', () => {
          httpOperation = anHttpOperation(httpOperation)
            .withResponses([
              {
                code: actualCode,
                content: [
                  {
                    mediaType: actualMediaType,
                    examples: [],
                  },
                  {
                    mediaType: actualMediaType,
                  },
                ],
              },
            ])
            .instance();

          expect(() => {
            helpers.negotiateOptionsForInvalidRequest(httpOperation.responses);
          }).toThrow('Data corrupted');
        });
      });
    });

    describe('and no 400 response exists', () => {
      test('should return an error', async () => {
        expect(() => {
          helpers.negotiateOptionsForInvalidRequest(httpOperation.responses);
        }).toThrow('No 400 response defined');
      });
    });
  });

  describe('negotiateOptionsForValidRequest()', () => {
    beforeEach(() => {
      jest.spyOn(helpers, 'negotiateOptionsForDefaultCode').mockImplementation(() => {
        // Spy
      });
      jest.spyOn(helpers, 'negotiateOptionsBySpecificCode').mockImplementation(() => {
        // Spy
      });
    });

    it('given status code enforced should negotiate a specific code', () => {
      const options = {
        code: chance.string(),
      };
      const expectedResult = {
        code: options.code,
      };
      jest.spyOn(helpers, 'negotiateOptionsForDefaultCode').mockImplementation(() => {
        // Spy
      });
      jest
        .spyOn(helpers, 'negotiateOptionsBySpecificCode')
        .mockImplementation(() => {
          // Spy
        })
        .mockReturnValue(expectedResult);

      const actualResult = helpers.negotiateOptionsForValidRequest(httpOperation, options);

      expect(helpers.negotiateOptionsForDefaultCode).not.toHaveBeenCalled();
      expect(helpers.negotiateOptionsBySpecificCode).toHaveBeenCalledTimes(1);
      expect(actualResult).toBe(expectedResult);
    });

    it('given status code not enforced should negotiate a default code', () => {
      const options = {};
      const expectedResult = {
        code: chance.string(),
      };
      jest
        .spyOn(helpers, 'negotiateOptionsForDefaultCode')
        .mockImplementation(() => {
          // Spy
        })
        .mockReturnValue(expectedResult);
      jest.spyOn(helpers, 'negotiateOptionsBySpecificCode').mockImplementation(() => {
        // Spy
      });

      const actualResult = helpers.negotiateOptionsForValidRequest(httpOperation, options);

      expect(helpers.negotiateOptionsBySpecificCode).not.toHaveBeenCalled();
      expect(helpers.negotiateOptionsForDefaultCode).toHaveBeenCalledTimes(1);
      expect(actualResult).toBe(expectedResult);
    });
  });

  describe('negotiateOptionsBySpecificCode()', () => {
    let negotiateOptionsBySpecificResponseMock: jest.Mock;
    let negotiateOptionsForDefaultCodeMock: jest.Mock;

    beforeEach(() => {
      negotiateOptionsBySpecificResponseMock = jest
        .spyOn(helpers, 'negotiateOptionsBySpecificResponse')
        .mockImplementation(() => {
          // Spy
        });
      negotiateOptionsForDefaultCodeMock = jest
        .spyOn(helpers, 'negotiateOptionsForDefaultCode')
        .mockImplementation(() => {
          // Spy
        });
    });
    it('given response defined should try to negotiate by that response', () => {
      const code = chance.string();
      const fakeResponse = {
        code,
        content: [],
      };
      const desiredOptions = {};
      const fakeOperationConfig = {
        code,
      };
      negotiateOptionsBySpecificResponseMock.mockReturnValue(fakeOperationConfig);
      httpOperation = anHttpOperation(httpOperation)
        .withResponses([fakeResponse])
        .instance();

      const actualOperationConfig = helpers.negotiateOptionsBySpecificCode(
        httpOperation,
        desiredOptions,
        code
      );

      expect(negotiateOptionsBySpecificResponseMock).toHaveBeenCalledTimes(1);
      expect(negotiateOptionsBySpecificResponseMock).toHaveBeenCalledWith(
        httpOperation,
        desiredOptions,
        fakeResponse
      );
      expect(negotiateOptionsForDefaultCodeMock).not.toHaveBeenCalled();
      expect(actualOperationConfig).toBe(fakeOperationConfig);
    });

    it('given response defined should fallback to default code on error', () => {
      const code = chance.string();
      const fakeResponse = {
        code,
        content: [],
      };
      const desiredOptions = {};
      const fakeOperationConfig = {
        code,
      };
      negotiateOptionsBySpecificResponseMock = negotiateOptionsBySpecificResponseMock.mockImplementation(
        () => {
          throw new Error();
        }
      );
      negotiateOptionsForDefaultCodeMock.mockReturnValue(fakeOperationConfig);
      httpOperation = anHttpOperation(httpOperation)
        .withResponses([fakeResponse])
        .instance();

      const actualOperationConfig = helpers.negotiateOptionsBySpecificCode(
        httpOperation,
        desiredOptions,
        code
      );

      expect(negotiateOptionsBySpecificResponseMock).toHaveBeenCalledTimes(1);
      expect(negotiateOptionsBySpecificResponseMock).toHaveBeenCalledWith(
        httpOperation,
        desiredOptions,
        fakeResponse
      );
      expect(negotiateOptionsForDefaultCodeMock).toHaveBeenCalledTimes(1);
      expect(negotiateOptionsForDefaultCodeMock).toHaveBeenCalledWith(
        httpOperation,
        desiredOptions
      );
      expect(actualOperationConfig).toBe(fakeOperationConfig);
    });

    it('given response not defined should fallback to default code', () => {
      const code = chance.string();
      const desiredOptions = {};
      const fakeOperationConfig = {
        code,
      };
      negotiateOptionsForDefaultCodeMock.mockReturnValue(fakeOperationConfig);
      httpOperation = anHttpOperation(httpOperation)
        .withResponses([])
        .instance();

      const actualOperationConfig = helpers.negotiateOptionsBySpecificCode(
        httpOperation,
        desiredOptions,
        code
      );

      expect(negotiateOptionsBySpecificResponseMock).not.toHaveBeenCalled();
      expect(negotiateOptionsForDefaultCodeMock).toHaveBeenCalledTimes(1);
      expect(negotiateOptionsForDefaultCodeMock).toHaveBeenCalledWith(
        httpOperation,
        desiredOptions
      );
      expect(actualOperationConfig).toBe(fakeOperationConfig);
    });
  });

  describe('negotiateOptionsForDefaultCode()', () => {
    it('given only a generic 2XX response should negotiate that one', () => {
      const desiredOptions = {};
      const response = {
        code: '2xx',
        content: [],
      };
      const fakeOperationConfig = {
        code: response.code,
      };
      jest
        .spyOn(helpers, 'negotiateOptionsBySpecificResponse')
        .mockReturnValue(fakeOperationConfig);
      httpOperation = anHttpOperation(httpOperation)
        .withResponses([response])
        .instance();

      const actualOperationConfig = helpers.negotiateOptionsForDefaultCode(
        httpOperation,
        desiredOptions
      );

      expect(helpers.negotiateOptionsBySpecificResponse).toHaveBeenCalledTimes(1);
      expect(actualOperationConfig).toBe(fakeOperationConfig);
    });

    it('given two 2xx response should negotiate the lowest', () => {
      const desiredOptions = {};
      const response = {
        code: '200',
        content: [],
      };
      const fakeOperationConfig = {
        code: response.code,
      };
      jest
        .spyOn(helpers, 'negotiateOptionsBySpecificResponse')
        .mockReturnValue(fakeOperationConfig);
      httpOperation = anHttpOperation(httpOperation)
        .withResponses([
          response,
          {
            code: '201',
            content: [],
          },
          {
            code: '2xx',
            content: [],
          },
        ])
        .instance();

      const actualOperationConfig = helpers.negotiateOptionsForDefaultCode(
        httpOperation,
        desiredOptions
      );

      expect(helpers.negotiateOptionsBySpecificResponse).toHaveBeenCalledTimes(1);
      expect(actualOperationConfig).toBe(fakeOperationConfig);
    });

    it('given no 2xx response should throw exception', () => {
      const desiredOptions = {};
      jest.spyOn(helpers, 'negotiateOptionsBySpecificResponse');

      expect(() => {
        helpers.negotiateOptionsForDefaultCode(httpOperation, desiredOptions);
      }).toThrow('No 2** response defined, cannot mock');
    });
  });

  describe('negotiateOptionsBySpecificResponse()', () => {
    describe('given forced mediaType', () => {
      it('and httpContent exists should negotiate that content', () => {
        const desiredOptions = {
          mediaType: chance.string(),
          dynamic: chance.bool(),
          exampleKey: chance.string(),
        };
        const content: IHttpContent = {
          mediaType: desiredOptions.mediaType,
        };
        const httpResponseSchema: IHttpResponse = {
          code: chance.string(),
          content: [content],
        };
        const fakeOperationConfig = {};
        jest
          .spyOn(helpers, 'negotiateByPartialOptionsAndHttpContent')
          .mockReturnValue(fakeOperationConfig);
        jest.spyOn(helpers, 'negotiateDefaultMediaType');

        const actualOperationConfig = helpers.negotiateOptionsBySpecificResponse(
          httpOperation,
          desiredOptions,
          httpResponseSchema
        );

        expect(helpers.negotiateByPartialOptionsAndHttpContent).toHaveBeenCalledTimes(1);
        expect(helpers.negotiateByPartialOptionsAndHttpContent).toHaveBeenCalledWith(
          {
            code: httpResponseSchema.code,
            dynamic: desiredOptions.dynamic,
            exampleKey: desiredOptions.exampleKey,
          },
          content
        );
        expect(helpers.negotiateDefaultMediaType).not.toHaveBeenCalled();
        expect(actualOperationConfig).toBe(fakeOperationConfig);
      });

      it('and httpContent not exist should negotiate default media type', () => {
        const desiredOptions = {
          mediaType: chance.string(),
          dynamic: chance.bool(),
          exampleKey: chance.string(),
        };
        const httpResponseSchema: IHttpResponse = {
          code: chance.string(),
          content: [],
        };
        const fakeOperationConfig = {};
        jest.spyOn(helpers, 'negotiateByPartialOptionsAndHttpContent');
        jest.spyOn(helpers, 'negotiateDefaultMediaType').mockReturnValue(fakeOperationConfig);

        const actualOperationConfig = helpers.negotiateOptionsBySpecificResponse(
          httpOperation,
          desiredOptions,
          httpResponseSchema
        );

        expect(helpers.negotiateByPartialOptionsAndHttpContent).not.toHaveBeenCalled();
        expect(helpers.negotiateDefaultMediaType).toHaveBeenCalledTimes(1);
        expect(helpers.negotiateDefaultMediaType).toHaveBeenCalledWith(
          {
            code: httpResponseSchema.code,
            dynamic: desiredOptions.dynamic,
            exampleKey: desiredOptions.exampleKey,
          },
          httpResponseSchema
        );
        expect(actualOperationConfig).toBe(fakeOperationConfig);
      });
    });

    describe('given no mediaType', () => {
      it('should negotiate default media type', () => {
        const desiredOptions = {
          dynamic: chance.bool(),
          exampleKey: chance.string(),
        };
        const httpResponseSchema: IHttpResponse = {
          code: chance.string(),
          content: [],
        };
        const fakeOperationConfig = {};
        jest.spyOn(helpers, 'negotiateByPartialOptionsAndHttpContent');
        jest.spyOn(helpers, 'negotiateDefaultMediaType').mockReturnValue(fakeOperationConfig);

        const actualOperationConfig = helpers.negotiateOptionsBySpecificResponse(
          httpOperation,
          desiredOptions,
          httpResponseSchema
        );

        expect(helpers.negotiateByPartialOptionsAndHttpContent).not.toHaveBeenCalled();
        expect(helpers.negotiateDefaultMediaType).toHaveBeenCalledTimes(1);
        expect(helpers.negotiateDefaultMediaType).toHaveBeenCalledWith(
          {
            code: httpResponseSchema.code,
            dynamic: desiredOptions.dynamic,
            exampleKey: desiredOptions.exampleKey,
          },
          httpResponseSchema
        );
        expect(actualOperationConfig).toBe(fakeOperationConfig);
      });
    });
  });

  describe('negotiateDefaultMediaType()', () => {
    it('given default content exists should negotiate that', () => {
      const code = chance.string();
      const partialOptions = {
        code,
        dynamic: chance.bool(),
        exampleKey: chance.string(),
      };
      const content: IHttpContent = {
        mediaType: 'application/json',
      };
      const response: IHttpResponse = {
        code,
        content: [content],
      };
      const fakeOperationConfig = {};
      jest
        .spyOn(helpers, 'negotiateByPartialOptionsAndHttpContent')
        .mockReturnValue(fakeOperationConfig);

      const actualOperationConfig = helpers.negotiateDefaultMediaType(partialOptions, response);

      expect(helpers.negotiateByPartialOptionsAndHttpContent).toHaveBeenCalledTimes(1);
      expect(helpers.negotiateByPartialOptionsAndHttpContent).toHaveBeenCalledWith(
        {
          code,
          dynamic: partialOptions.dynamic,
          exampleKey: partialOptions.exampleKey,
        },
        content
      );
      expect(actualOperationConfig).toBe(fakeOperationConfig);
    });

    it('given no default content should throw', () => {
      const code = chance.string();
      const partialOptions = { code: '200' };
      const response: IHttpResponse = {
        code,
        content: [],
      };

      expect(() => {
        helpers.negotiateDefaultMediaType(partialOptions, response);
      }).toThrow(
        /Could not generate response for provided content type or no content type provided/
      );
    });
  });

  describe('negotiateByPartialOptionsAndHttpContent()', () => {
    describe('given exampleKey forced', () => {
      it('and example exists should return that example', () => {
        const exampleKey = chance.string();
        const partialOptions = {
          code: chance.string(),
          exampleKey,
          dynamic: chance.bool(),
        };
        const example: IExample = {
          key: exampleKey,
        };
        const httpContent: IHttpContent = {
          mediaType: chance.string(),
          examples: [example],
        };

        const actualOperationConfig = helpers.negotiateByPartialOptionsAndHttpContent(
          partialOptions,
          httpContent
        );

        expect(actualOperationConfig).toEqual({
          code: partialOptions.code,
          mediaType: httpContent.mediaType,
          example,
        });
      });

      it('and example not exist should throw an error', () => {
        const exampleKey = chance.string();
        const partialOptions = {
          code: chance.string(),
          exampleKey,
          dynamic: chance.bool(),
        };
        const httpContent: IHttpContent = {
          mediaType: chance.string(),
          examples: [],
        };

        expect(() => {
          helpers.negotiateByPartialOptionsAndHttpContent(partialOptions, httpContent);
        }).toThrow(
          `Response for contentType: ${
            httpContent.mediaType
          } and exampleKey: ${exampleKey} does not exist.`
        );
      });
    });

    describe('given exampleKey not forced but dynamic forced', () => {
      it('and httpContent has schema return that content', () => {
        const partialOptions = {
          code: chance.string(),
          dynamic: true,
        };
        const httpContent: IHttpContent = {
          mediaType: chance.string(),
          examples: [],
          schema: { type: 'string' },
        };

        const actualOperationConfig = helpers.negotiateByPartialOptionsAndHttpContent(
          partialOptions,
          httpContent
        );

        expect(actualOperationConfig).toEqual({
          code: partialOptions.code,
          mediaType: httpContent.mediaType,
          schema: httpContent.schema,
        });
      });

      it('and httpContent has no schema throw error', () => {
        const partialOptions = {
          code: chance.string(),
          dynamic: true,
        };
        const httpContent: IHttpContent = {
          mediaType: chance.string(),
          examples: [],
        };

        expect(() => {
          helpers.negotiateByPartialOptionsAndHttpContent(partialOptions, httpContent);
        }).toThrow(
          `Tried to force a dynamic response for: ${
            httpContent.mediaType
          } but schema is not defined.`
        );
      });
    });

    describe('given neither exampleKey nor dynamic forced', () => {
      it('and can find other example return that example', () => {
        const partialOptions = {
          code: chance.string(),
        };
        const example: IExample = {
          key: chance.string(),
        };
        const httpContent: IHttpContent = {
          mediaType: chance.string(),
          examples: [
            example,
            {
              key: chance.string(),
            },
          ],
        };

        const actualOperationConfig = helpers.negotiateByPartialOptionsAndHttpContent(
          partialOptions,
          httpContent
        );

        expect(actualOperationConfig).toEqual({
          code: partialOptions.code,
          mediaType: httpContent.mediaType,
          example,
        });
      });

      it('and cannot find example but schema exists return dynamic', () => {
        const partialOptions = {
          code: chance.string(),
        };
        const httpContent: IHttpContent = {
          mediaType: chance.string(),
          examples: [],
          schema: { type: 'string' },
        };

        const actualOperationConfig = helpers.negotiateByPartialOptionsAndHttpContent(
          partialOptions,
          httpContent
        );

        expect(actualOperationConfig).toEqual({
          code: partialOptions.code,
          mediaType: httpContent.mediaType,
          schema: { type: 'string' },
        });
      });

      it('and cannot find example and dynamic does not exist throw error', () => {
        const partialOptions = {
          code: chance.string(),
        };
        const httpContent: IHttpContent = {
          mediaType: chance.string(),
          examples: [],
        };

        expect(() => {
          helpers.negotiateByPartialOptionsAndHttpContent(partialOptions, httpContent);
        }).toThrow(`Not possible to generate a response for contentType: ${httpContent.mediaType}`);
      });
    });
  });
});
