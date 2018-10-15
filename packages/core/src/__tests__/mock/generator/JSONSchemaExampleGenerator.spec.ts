import { JSONSchemaExampleGenerator } from '../../../mock/generator/JSONSchemaExampleGenerator';

describe('JSONSchemaExampleGenerator', () => {
  let jsonSchemaExampleGenerator: JSONSchemaExampleGenerator;

  beforeEach(() => {
    jsonSchemaExampleGenerator = new JSONSchemaExampleGenerator();
  });

  describe('generate()', () => {
    it('generates dynamic example from schema', async () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
        required: ['name', 'email'],
      };

      const example = await jsonSchemaExampleGenerator.generate(schema, 'application/json');
      const instance = JSON.parse(example);

      expect(instance.name).toMatch(/^.+$/);

      // naive email check, should be enough
      expect(instance.email).toMatch(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/);
    });

    it('fails when media type is unknown', async () => {
      expect(
        jsonSchemaExampleGenerator.generate({}, 'non-existing/media-type')
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
