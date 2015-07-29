import migration from '../../lib/migration';
import {expect} from 'chai';

describe('lib/migration', () => {
  describe('Base', () => {
    it('should do the job yo!', () => {
      let input = `test("jQuery.each/map(undefined/null,Function)", 1, function() {})`;
      let output = `test("jQuery.each/map(undefined/null,Function)", function() {
expect( 1 );
})`;

      expect(migration(input)).to.equal(output);
    });
  });

  describe('indentation', () => {
    it('should do the correct indentation manipulation', () => {
      let input = `
    test("jQuery.each/map(undefined/null,Function)", 1, function() {
      equal("test");
    })`;
      let output = `
    test("jQuery.each/map(undefined/null,Function)", function() {
      expect( 1 );

      equal("test");
    })`;

      expect(migration(input)).to.equal(output);
    });
  });
});
