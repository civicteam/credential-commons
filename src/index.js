const { Claim } = require('./entities/Claim');
const VC = require('./creds/VerifiableCredential');
const { initServices, services } = require('./services/index');
const isValidGlobalIdentifier = require('./isValidGlobalIdentifier');
const errors = require('./errors');
const constants = require('./constants');

/**
 * Entry Point for Civic Credential Commons
 * @returns {CredentialCommons}
 * @constructor
 */
function CredentialCommons() {
  this.Claim = Claim;
  this.VC = VC;
  this.init = initServices;
  this.isValidGlobalIdentifier = isValidGlobalIdentifier;
  this.services = services;
  this.errors = errors;
  this.constants = constants;
  return this;
}

// to work with entry points in multi module manage the best way
module.exports = new CredentialCommons();
