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
      expect(convertAjvErrors([errorObjectFixture], ValidationSeverity.ERROR)).toMatchSnapshot();
    });
  });

  describe('keyword field is missing', () => {
    it('converts properly', () => {
      expect(
        convertAjvErrors(
          [Object.assign({}, errorObjectFixture, { keyword: undefined })],
          ValidationSeverity.ERROR
        )
      ).toMatchSnapshot();
    });
  });

  describe('message field is missing', () => {
    it('converts properly', () => {
      expect(
        convertAjvErrors(
          [Object.assign({}, errorObjectFixture, { message: undefined })],
          ValidationSeverity.ERROR
        )
      ).toMatchSnapshot();
    });
  });

  describe('errors are not set', () => {
    it('converts properly', () => {
      expect(convertAjvErrors(null, ValidationSeverity.ERROR)).toMatchSnapshot();
    });
  });
});
