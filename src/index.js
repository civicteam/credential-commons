const { Claim, Identifier, AttestableEntity } = require('./entities');
const VC = require('./creds/VerifiableCredential_old');
const { initServices, services } = require('./services/index');
const isValidGlobalIdentifier = require('./isValidGlobalIdentifier');
const errors = require('./errors');
const constants = require('./constants');
const schema = require('./schema/jsonSchema');

const credentialCommons = {
  Claim,
  Identifier,
  AttestableEntity,
  VC,
  init: initServices,
  isValidGlobalIdentifier,
  services,
  errors,
  constants,
};

module.exports = {
  initialize: () => schema.initialize().then(() => credentialCommons),
};
