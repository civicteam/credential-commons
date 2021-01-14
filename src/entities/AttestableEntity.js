const { Identifier } = require('./ParsedIdentifier');
const DEFAULT_BUILDER = require('../schemas/loader/jsonSchemaLoader');

class AttestableEntity {
  constructor(identifier, value, builder = DEFAULT_BUILDER) {
    this.parsedIdentifier = new Identifier(identifier, builder);

    const { schemaInformation } = this.parsedIdentifier;

    builder.validate(schemaInformation.ref, value);

    this.schema = schemaInformation.schema;

    this.value = value;
    this.identifier = identifier;
    this.version = this.parsedIdentifier.version;
    this.type = this.schema.type;
  }
}

module.exports = { AttestableEntity };
