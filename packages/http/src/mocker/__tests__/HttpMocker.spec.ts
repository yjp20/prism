import { HttpMocker } from '@stoplight/prism-http/mocker';
import { JSONSchemaExampleGenerator } from '@stoplight/prism-http/mocker/generator/JSONSchemaExampleGenerator';
import HttpOperationConfigNegotiator from '@stoplight/prism-http/negotiator/HttpOperationConfigNegotiator';
import { IHttpMethod } from '@stoplight/prism-http/types';
import { IHttpOperation } from '@stoplight/types/http';

describe.skip('HttpMocker', () => {
  let httpMocker: HttpMocker;

  beforeEach(() => {
    httpMocker = new HttpMocker(
      new HttpOperationConfigNegotiator(),
      new JSONSchemaExampleGenerator()
    );
  });

  it('test', async () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
      },
      required: ['name', 'email'],
    };

    const resource: IHttpOperation = {
      id: 'id',
      method: 'GET',
      path: '/test',
      responses: [
        {
          code: '200',
          content: [
            {
              mediaType: 'application/json',
              schema,
              examples: [
                {
                  key: 'myk',
                  value: 'pyk',
                },
              ],
            },
          ],
        },
      ],
    };

    const result = await httpMocker.mock({
      resource,
      input: {
        validations: {
          input: [],
        },
        data: {
          method: 'get' as IHttpMethod,
          path: '/test',
          host: 'x.com',
        },
      },
      config: {
        mock: {
          exampleKey: 'myk',
        },
      },
    });

    console.log(result);
  });
});
