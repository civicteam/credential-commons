const { Claim, Identifier, AttestableEntity } = require('./entities');
const VC = require('./creds/VerifiableCredential');
const { initServices, services } = require('./services/index');
const isValidGlobalIdentifier = require('./isValidGlobalIdentifier');
const errors = require('./errors');
const constants = require('./constants');

module.exports = {
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
