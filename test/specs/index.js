import {paths} from '../../src/index';
import {expect} from 'chai';

describe('lib/index', () => {
  describe('paths', () => {
    it('should get paths', () => {
      expect(
        paths(['test/data/*.js'])[0]
      ).to.include('qunit-migration/test/data/index.js');
    });
  });
});
