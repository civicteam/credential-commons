// eslint-disable-next-line max-classes-per-file
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const { AttestableEntity } = require('./AttestableEntity');

class VerifiableCredential extends AttestableEntity {
  constructor({
    metadata,
    claims,
    proofs,
  }) {
    const claimValues = _.mapValues(claims, (claim) => claim.value);
    super(metadata.identifier, { ...metadata, claim: claimValues });

    this.metadata = metadata;
    this.claims = claims;
    this.proofs = proofs;
  }
}

VerifiableCredential.Metadata = class {
  constructor({
    id, identifier, issuer, issuanceDate, type, transient = false,
  }) {
    this.id = id || uuidv4();
    this.identifier = identifier;
    this.issuer = issuer;
    this.issuanceDate = issuanceDate || (new Date()).toISOString();
    this.type = type || ['Credential', identifier]; // by default, the type is the identifier
    this.transient = transient;
  }
};

module.exports = { VerifiableCredential };
