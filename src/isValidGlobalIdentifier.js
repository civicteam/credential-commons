const { ParsedIdentifier } = require('./entities');

const isValidGlobalIdentifier = (identifier) => {
  // eslint-disable-next-line no-new
  new ParsedIdentifier(identifier);
  // if this doesn't fail, the identifier is a valid one
  return true;
};

module.exports = isValidGlobalIdentifier;
