const { ParsedIdentifier } = require('./ParsedIdentifier');
const DEFAULT_BUILDER = require('../schema/loader/jsonSchemaLoader');

class AttestableEntity {
  get identifier() {
    return this.parsedIdentifier.identifier;
  }

  constructor(identifier, value, builder = DEFAULT_BUILDER) {
    this.parsedIdentifier = new ParsedIdentifier(identifier, builder);

    const { schemaInformation } = this.parsedIdentifier;

    builder.validate(schemaInformation.ref, value);

    this.schema = schemaInformation.schema;

    this.value = value;
    this.version = this.parsedIdentifier.version;
    this.type = this.schema.type;
  }
}

module.exports = { AttestableEntity };
