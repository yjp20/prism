import { IHttpOperation } from '@stoplight/types/http';

import { HttpMocker } from '../../mocker';
import { JSONSchemaExampleGenerator } from '../../mocker/generator/JSONSchemaExampleGenerator';
import { IHttpMethod } from '../../types';
import helpers from '../negotiator/NegotiatorHelpers';

describe('HttpMocker', () => {
  let httpMocker: HttpMocker;
  const mockExampleGenerator = new JSONSchemaExampleGenerator();

  beforeEach(() => {
    httpMocker = new HttpMocker(mockExampleGenerator);
    jest.spyOn(helpers, 'negotiateOptionsForValidRequest').mockImplementation(jest.fn);
    jest.spyOn(helpers, 'negotiateOptionsForInvalidRequest').mockImplementation(jest.fn);
    jest.spyOn(mockExampleGenerator, 'generate').mockImplementation(jest.fn);
  });

  describe('mock()', () => {
    const mockSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
      },
      required: ['name', 'email'],
    };

    const mockResource: IHttpOperation = {
      id: 'id',
      method: 'get',
      path: '/test',
      responses: [
        {
          code: '200',
          content: [
            {
              mediaType: 'application/json',
              schema: mockSchema,
              examples: [
                {
                  key: 'test key',
                  value: 'test value',
                },
              ],
            },
          ],
        },
      ],
    };

    const mockInput = {
      validations: {
        input: [],
      },
      data: {
        method: 'get' as IHttpMethod,
        path: '/test',
        host: 'example.com',
      },
    };

    it('fails when called with no resource', () => {
      return expect(
        httpMocker.mock({
          input: mockInput,
        })
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('fails when called with no input', () => {
      return expect(
        httpMocker.mock({
          resource: mockResource,
        })
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    describe('with valid negotiator response', () => {
      it('fails when negotiator did not resolved to either example nor schema', () => {
        jest
          .spyOn(helpers, 'negotiateOptionsForValidRequest')
          .mockImplementation(() => ({ code: '202', mediaType: 'test' }));

        return expect(
          httpMocker.mock({
            resource: mockResource,
            input: mockInput,
          })
        ).rejects.toThrowErrorMatchingSnapshot();
      });

      it('returns static example', () => {
        jest.spyOn(helpers, 'negotiateOptionsForValidRequest').mockImplementation(() => ({
          code: '202',
          mediaType: 'test',
          example: mockResource.responses![0].content![0].examples![0],
        }));

        return expect(
          httpMocker.mock({
            resource: mockResource,
            input: mockInput,
          })
        ).resolves.toMatchSnapshot();
      });

      it('returns dynamic example', () => {
        jest.spyOn(helpers, 'negotiateOptionsForValidRequest').mockImplementation(() => ({
          code: '202',
          mediaType: 'test',
          schema: mockResource.responses![0].content![0].schema,
        }));

        jest.spyOn(mockExampleGenerator, 'generate').mockImplementation(() => 'example value');

        return expect(
          httpMocker.mock({
            resource: mockResource,
            input: mockInput,
          })
        ).resolves.toMatchSnapshot();
      });

      it('defaults to empty mock configuration when called with boolean mock value', async () => {
        const spy = jest
          .spyOn(helpers, 'negotiateOptionsForValidRequest')
          .mockImplementation(() => ({
            code: '202',
            mediaType: 'test',
            example: mockResource.responses![0].content![0].examples![0],
          }));

        await httpMocker.mock({
          resource: mockResource,
          input: mockInput,
          config: { mock: true },
        });

        expect(spy).toHaveBeenCalledWith(mockResource, {});
      });
    });

    describe('with invalid negotiator response', () => {
      it('returns static example', () => {
        jest.spyOn(helpers, 'negotiateOptionsForInvalidRequest').mockImplementation(() => ({
          code: '202',
          mediaType: 'test',
          example: mockResource.responses![0].content![0].examples![0],
        }));

        return expect(
          httpMocker.mock({
            resource: mockResource,
            input: Object.assign({}, mockInput, { validations: { input: [{}] } }),
          })
        ).resolves.toMatchSnapshot();
      });
    });
  });
});
