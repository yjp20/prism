import { ValidationSeverity } from '@stoplight/prism-core/types';
import { convertAjvErrors } from '../convertAjvErrors';

describe('convertAjvErrors()', () => {
  const errorObjectFixture = {
    dataPath: 'a.b',
    keyword: 'required',
    message: 'c is required',
    schemaPath: '..',
    params: '',
  };

  describe('all fields defined', () => {
    it('converts properly', () => {
      expect(
        convertAjvErrors([errorObjectFixture], 'prefix', ValidationSeverity.ERROR)
      ).toMatchSnapshot();
    });
  });

  describe('keyword field is missing', () => {
    expect(
      convertAjvErrors(
        [Object.assign({}, errorObjectFixture, { keyword: undefined })],
        'prefix',
        ValidationSeverity.ERROR
      )
    ).toMatchSnapshot();
  });

  describe('message field is missing', () => {
    expect(
      convertAjvErrors(
        [Object.assign({}, errorObjectFixture, { message: undefined })],
        'prefix',
        ValidationSeverity.ERROR
      )
    ).toMatchSnapshot();
  });
});
