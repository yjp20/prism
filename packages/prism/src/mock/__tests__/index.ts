import { Mocker } from '../index';

describe('Mocker', () => {
  let mocker: Mocker;

  beforeEach(() => {
    mocker = new Mocker();
  });

  describe('mock()', () => {
    it('mocks', () => {
      expect(mocker.mock('test')).toMatchSnapshot();
    });
  });
});
