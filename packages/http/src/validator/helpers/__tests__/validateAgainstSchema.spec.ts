import * as convertAjvErrorsModule from '../convertAjvErrors';
import { validateAgainstSchema } from '../validateAgainstSchema';

describe('validateAgainstSchema()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(convertAjvErrorsModule, 'convertAjvErrors');
  });

  describe('has no validation errors', () => {
    it('returns no validation errors', () => {
      expect(validateAgainstSchema('test', { type: 'string' }, 'pfx')).toEqual([]);
      expect(convertAjvErrorsModule.convertAjvErrors).not.toHaveBeenCalled();
    });
  });

  describe('has validation errors', () => {
    it('returns validation errors', () => {
      jest.spyOn(convertAjvErrorsModule, 'convertAjvErrors').mockImplementationOnce(() => [
        {
          message: 'should be number',
          name: 'type',
          path: [],
          severity: 'error',
          summary: 'should be number',
        },
      ]);
      expect(validateAgainstSchema('test', { type: 'number' }, 'pfx')).toMatchSnapshot();
      expect(convertAjvErrorsModule.convertAjvErrors).toHaveBeenCalledWith(
        [
          {
            dataPath: '',
            keyword: 'type',
            message: 'should be number',
            params: { type: 'number' },
            schemaPath: '#/type',
          },
        ],
        'error'
      );
    });
  });
});
