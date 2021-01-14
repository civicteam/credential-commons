const stringUtils = require('../../src/lib/stringUtils');

describe('stringUtils', () => {
  describe('pascalToCamelCase', () => {
    it('converts PascalCase to camelCase', () => {
      expect(stringUtils.pascalToCamelCase('SocialSecurity')).toEqual('socialSecurity');
    });

    it('leaves already camelCased strings alone', () => {
      expect(stringUtils.pascalToCamelCase('socialSecurity')).toEqual('socialSecurity');
    });

    // the function is not designed to work with non-PascalCase strings
    it('behaves naively with other string types', () => {
      expect(stringUtils.pascalToCamelCase('THIS_IS_WEIRD')).toEqual('tHIS_IS_WEIRD');
    });
  });
});
