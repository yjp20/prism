import { IValidation, ValidationSeverity } from '@stoplight/prism-core/types';
import { anHttpOperation } from '@stoplight/prism-http/mocker/negotiator/__tests__/utils';
import { IHttpRequest } from '@stoplight/prism-http/types';
import { Chance } from 'chance';

import HttpOperationConfigNegotiator from '../HttpOperationConfigNegotiator';
import helpers from '../NegotiatorHelpers';

const chance = new Chance();

describe('HttpOperationOptionsNegotiator', () => {
  let negotiator: HttpOperationConfigNegotiator;

  beforeEach(() => {
    negotiator = new HttpOperationConfigNegotiator();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('negotiate()', () => {
    const httpOperationConfig = {
      code: chance.string(),
      mediaType: chance.string(),
      exampleKey: chance.string(),
      dynamic: chance.bool(),
    };
    const httpRequest: IHttpRequest = {
      method: 'get',
      path: '',
      host: '',
    };
    const desiredConfig = {};
    const httpOperation = anHttpOperation().instance();

    function getOpts(resource: any, input: any, config: any) {
      return { resource, input, config };
    }

    describe('given valid input', () => {
      it('and negotiations succeed should return config', async () => {
        jest.spyOn(helpers, 'negotiateOptionsForValidRequest').mockReturnValue(httpOperationConfig);

        const result = await negotiator.negotiate(
          getOpts(
            httpOperation,
            {
              data: httpRequest,
              validations: {
                input: [],
              },
            },
            desiredConfig
          )
        );

        expect(helpers.negotiateOptionsForValidRequest).toHaveBeenCalledTimes(1);
        expect(helpers.negotiateOptionsForValidRequest).toHaveBeenCalledWith(
          httpOperation,
          desiredConfig
        );
        expect(result).toEqual({
          httpOperationConfig,
        });
      });

      it('and negotiations fail should return error', async () => {
        const error = new Error('fake error');
        jest.spyOn(helpers, 'negotiateOptionsForValidRequest').mockImplementation(() => {
          throw error;
        });

        const result = await negotiator.negotiate(
          getOpts(
            httpOperation,
            {
              data: httpRequest,
              validations: {
                input: [],
              },
            },
            desiredConfig
          )
        );

        expect(helpers.negotiateOptionsForValidRequest).toHaveBeenCalledTimes(1);
        expect(helpers.negotiateOptionsForValidRequest).toHaveBeenCalledWith(
          httpOperation,
          desiredConfig
        );
        expect(result).toEqual({
          error,
        });
      });
    });

    describe('given invalid input', () => {
      const validation: IValidation = {
        path: [''],
        name: 'string',
        summary: 'string',
        severity: ValidationSeverity.ERROR,
        message: 'string',
      };

      it('and negotiations succeed should return config', async () => {
        jest
          .spyOn(helpers, 'negotiateOptionsForInvalidRequest')
          .mockReturnValue(httpOperationConfig);

        const result = await negotiator.negotiate(
          getOpts(
            httpOperation,
            {
              data: httpRequest,
              validations: {
                input: [validation],
              },
            },
            desiredConfig
          )
        );

        expect(helpers.negotiateOptionsForInvalidRequest).toHaveBeenCalledTimes(1);
        expect(helpers.negotiateOptionsForInvalidRequest).toHaveBeenCalledWith(
          httpOperation.responses
        );
        expect(result).toEqual({
          httpOperationConfig,
        });
      });

      it('and negotiations fail should return error', async () => {
        const error = new Error();
        jest.spyOn(helpers, 'negotiateOptionsForInvalidRequest').mockImplementation(() => {
          throw error;
        });

        const result = await negotiator.negotiate(
          getOpts(
            httpOperation,
            {
              data: httpRequest,
              validations: {
                input: [validation],
              },
            },
            desiredConfig
          )
        );

        expect(helpers.negotiateOptionsForInvalidRequest).toHaveBeenCalledTimes(1);
        expect(helpers.negotiateOptionsForInvalidRequest).toHaveBeenCalledWith(
          httpOperation.responses
        );
        expect(result).toEqual({
          error,
        });
      });
    });
  });
});
