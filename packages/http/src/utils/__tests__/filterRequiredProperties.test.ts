import { JSONSchema } from '../../types';
import { stripReadOnlyProperties, stripWriteOnlyProperties } from '../filterRequiredProperties';
import { assertSome } from '@stoplight/prism-core/src/__tests__/utils';

describe('filterRequiredProperties', () => {
  it('strips writeOnly properties', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string', writeOnly: true },
        title: { type: 'string', readOnly: true },
      },
      required: ['name', 'description', 'title'],
    };

    assertSome(stripWriteOnlyProperties(schema), schema => {
      expect(schema.required).toEqual(['name', 'title']);
      expect(schema.properties).toMatchObject({
        name: expect.any(Object),
        title: expect.any(Object),
      });
    });
  });

  it('strips readOnly properties', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string', writeOnly: true },
        title: { type: 'string', readOnly: true },
      },
      required: ['name', 'description', 'title'],
    };

    assertSome(stripReadOnlyProperties(schema), schema => {
      expect(schema.required).toEqual(['name', 'description']);
      expect(schema.properties).toMatchObject({
        name: expect.any(Object),
        description: expect.any(Object),
      });
    });
  });

  it('strips nested properties', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        title: { type: 'string', readOnly: true },
        author: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            username: { type: 'string', writeOnly: true },
          },
          required: ['userId', 'username'],
        },
      },
      required: ['name', 'title', 'author'],
    };

    assertSome(stripWriteOnlyProperties(schema), schema => {
      expect(schema.required).toEqual(['name', 'title', 'author']);
      expect(schema.properties).toMatchObject({
        name: expect.any(Object),
        title: expect.any(Object),
        author: expect.objectContaining({
          properties: {
            userId: {
              type: 'string',
            },
          },
          required: ['userId'],
        }),
      });
    });
  });
});
