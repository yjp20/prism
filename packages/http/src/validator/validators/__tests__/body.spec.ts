import { HttpParamStyles, IMediaTypeContent } from '@stoplight/types';
import { JSONSchema } from '../../..';
import { validate, findContentByMediaTypeOrFirst, ForUnitTesting } from '../body';
import { assertRight, assertLeft, assertSome } from '@stoplight/prism-core/src/__tests__/utils';
import { ValidationContext } from '../types';

describe('validate()', () => {
  describe('content specs are missing', () => {
    it('returns no validation errors', () => {
      assertRight(validate('test', [], ValidationContext.Input));
    });
  });

  describe('request media type is not provided', () => {
    it('returns no validation errors', () => {
      assertRight(
        validate(
          'test',
          [{ mediaType: 'application/not-exists-son', examples: [], encodings: [] }],
          ValidationContext.Input
        )
      );
    });
  });

  describe('request media type was not found in spec', () => {
    it('returns no validation errors', () => {
      assertRight(
        validate(
          'test',
          [{ mediaType: 'application/not-exists-son', examples: [], encodings: [] }],
          ValidationContext.Input,
          'application/json'
        )
      );
    });
  });

  describe('body schema is provided', () => {
    it('return validation errors', () => {
      const mockSchema: JSONSchema = { type: 'number' };
      assertLeft(
        validate(
          'test',
          [{ mediaType: 'application/json', schema: mockSchema, examples: [], encodings: [] }],
          ValidationContext.Input,
          'application/json'
        ),
        error => expect(error).toContainEqual(expect.objectContaining({ code: 'type', message: 'must be number' }))
      );
    });
  });

  describe('body is form-urlencoded with deep object style', () => {
    it('returns no validation errors', () => {
      assertRight(
        validate(
          encodeURI('key[a]=str'),
          [
            {
              mediaType: 'application/x-www-form-urlencoded',
              encodings: [{ property: 'key', style: HttpParamStyles.DeepObject }],
              schema: {
                type: 'object',
                properties: {
                  key: {
                    type: 'object',
                    properties: { a: { type: 'string' } },
                    required: ['a'],
                  },
                },
                required: ['key'],
              },
            },
          ],
          ValidationContext.Input,
          'application/x-www-form-urlencoded'
        )
      );
    });
  });

  describe('body is form-urlencoded with deep object style and is not compatible with schema', () => {
    it('returns validation errors', () => {
      assertLeft(
        validate(
          encodeURI('key[a][ab]=str'),
          [
            {
              mediaType: 'application/x-www-form-urlencoded',
              encodings: [{ property: 'key', style: HttpParamStyles.DeepObject }],
              schema: {
                type: 'object',
                properties: {
                  key: {
                    type: 'object',
                    properties: {
                      a: {
                        type: 'object',
                        properties: { aa: { type: 'string' } },
                        required: ['aa'],
                      },
                    },
                    required: ['a'],
                  },
                },
                required: ['key'],
              },
            },
          ],
          ValidationContext.Input,
          'application/x-www-form-urlencoded'
        ),
        error =>
          expect(error).toContainEqual(
            expect.objectContaining({
              code: 'required',
              message: "must have required property 'aa'",
            })
          )
      );
    });
  });

  describe('readOnly writeOnly parameters', () => {
    const specs: IMediaTypeContent[] = [
      {
        mediaType: 'application/json',
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
              writeOnly: true,
            },
            title: {
              type: 'string',
              readOnly: true,
            },
          },
          required: ['name', 'description', 'title'],
        },
      },
    ];
    it('requires writeOnly params from input', () => {
      assertLeft(validate({ name: 'Item One' }, specs, ValidationContext.Input, 'application/json'), error => {
        expect(error[0].message).toEqual("must have required property 'description'");
      });
    });
    it('succeed when writeOnly params are provided', () => {
      assertRight(
        validate(
          { name: 'Item One', description: 'some description' },
          specs,
          ValidationContext.Input,
          'application/json'
        )
      );
    });
    it('requires readOnly params from output', () => {
      assertLeft(validate({ name: 'Item One' }, specs, ValidationContext.Output, 'application/json'), error => {
        expect(error[0].message).toEqual("must have required property 'title'");
      });
    });
    it('succeed when readOnly params are provided', () => {
      assertRight(validate({ name: 'Item One', title: 'title' }, specs, ValidationContext.Output, 'application/json'));
    });
  });
});

describe('findContentByMediaTypeOrFirst()', () => {
  describe('when a spec has a content type', () => {
    const content: IMediaTypeContent = {
      mediaType: 'application/x-www-form-urlencoded',
    };

    describe('and I request for the content type with the charset', () => {
      const foundContent = findContentByMediaTypeOrFirst([content], 'application/x-www-form-urlencoded; charset=UTF-8');

      it('should return the generic content', () => assertSome(foundContent));
    });
  });
});

const normalizeSchemaProcessorMap = ForUnitTesting.normalizeSchemaProcessorMap;
describe('normalizeSchemaProcessorMap', () => {
  describe('when schema contains allOf', () => {
    it('should remove readOnly properties from input', () => {
      // Arrange
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          writeOnlyProperty: { allOf: [{ writeOnly: true }, { type: 'string' }] },
          // NOTE: readOnly is nested inside allOf
          readOnlyProperty: { allOf: [{ readOnly: true }, { type: 'string' }] },
        },
        required: ['name', 'writeOnlyProperty', 'readOnlyProperty'],
      };
      const normalizer = normalizeSchemaProcessorMap[ValidationContext.Input];

      // Act
      const actual = normalizer(schema);

      // Assert
      assertSome(actual, actual => {
        console.log(actual);
        expect(actual.required).toEqual(['name', 'writeOnlyProperty']);
        expect(actual.properties).toEqual({
          name: expect.any(Object),
          writeOnlyProperty: expect.any(Object),
        });
      });
    });

    it('should remove writeOnly properties from output', () => {
      // Arrange
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          // NOTE: writeOnly is nested inside allOf
          writeOnlyProperty: { allOf: [{ writeOnly: true }, { type: 'string' }] },
          readOnlyProperty: { allOf: [{ readOnly: true }, { type: 'string' }] },
        },
        required: ['name', 'writeOnlyProperty', 'readOnlyProperty'],
      };
      const normalizer = normalizeSchemaProcessorMap[ValidationContext.Output];

      // Act
      const actual = normalizer(schema);

      // Assert
      assertSome(actual, actual => {
        console.log(actual);
        expect(actual.required).toEqual(['name', 'readOnlyProperty']);
        expect(actual.properties).toEqual({
          name: expect.any(Object),
          readOnlyProperty: expect.any(Object),
        });
      });
    });
  });
});
