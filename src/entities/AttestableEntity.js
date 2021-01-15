const { ParsedIdentifier } = require('./ParsedIdentifier');
const DEFAULT_BUILDER = require('../schema/jsonSchema');

class AttestableEntity {
  get identifier() {
    return this.parsedIdentifier.identifier;
  }

  constructor(identifier, value, uriPrefix, builder = DEFAULT_BUILDER) {
    this.parsedIdentifier = new ParsedIdentifier(identifier, uriPrefix, builder);

    const { schemaInformation } = this.parsedIdentifier;

    builder.validate(schemaInformation.ref, value);

    this.schema = schemaInformation.schema;

    this.value = value;
    this.version = this.parsedIdentifier.version;
    this.type = this.schema.type;
  }
}

module.exports = { AttestableEntity };
