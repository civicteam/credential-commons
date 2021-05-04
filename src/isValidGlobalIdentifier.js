const _ = require('lodash');
const { definitions } = require('@identity.com/uca');
const vcDefinitions = require('./creds/definitions');
const { schemaLoader } = require('./schemas/jsonSchema');

const validUCAIdentifiers = _.map(definitions, d => d.identifier);
const validClaimIdentifiers = schemaLoader.validIdentifiers;
const validVCIdentifiers = _.map(vcDefinitions, d => d.identifier);
const validPrefixes = ['claim', 'credential'];

function isValidGlobalIdentifier(identifier) {
  schemaLoader.loadSchemaFromTitle(identifier);

  const splited = _.split(identifier, '-');

  if (splited.length !== 3) {
    throw new Error('Malformed Global Identifier');
  }

  if (!_.includes(validPrefixes, splited[0])) {
    throw new Error('Invalid Global Identifier Prefix');
  }

  switch (splited[0]) {
    case 'claim':
      if (!_.includes(validUCAIdentifiers, splited[1]) && !_.includes(validClaimIdentifiers, identifier)) {
        throw new Error(`${identifier} is not valid`);
      }
      return true;
    case 'credential':
      if (!_.includes(validVCIdentifiers, splited[1]) && !_.includes(validVCIdentifiers, identifier)) {
        throw new Error(`${identifier} is not valid`);
      }
      return true;
    default:
      return false;
  }
}

module.exports = isValidGlobalIdentifier;
