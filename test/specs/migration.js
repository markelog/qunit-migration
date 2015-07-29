import migration from '../../src/migration';
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

    it('should asd', () => {
      let input = `
test( "prop('tabindex', value)", 10, function() {

  var clone,
    element = jQuery("#divWithNoTabIndex");
  });`;
      let output = `
test( "prop('tabindex', value)", function() {
  expect( 10 );

  var clone,
    element = jQuery("#divWithNoTabIndex");
  });`;

      expect(migration(input)).to.equal(output);
    });
  });
});
