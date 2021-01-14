const DEFAULT_BUILDER = require('../schemas/loader/jsonSchemaLoader');

class AttestableEntity {
  constructor(identifier, value, builder = DEFAULT_BUILDER) {
    const schemaObject = builder.loadSchemaObject(identifier);

    builder.validate(schemaObject.ref, value);

    this.parsedIdentifier = schemaObject.parsedIdentifier;
    this.schema = schemaObject.schema;

    this.value = value;
    this.identifier = identifier;
    this.version = this.parsedIdentifier.version;
    this.type = this.schema.type;
  }
}

module.exports = { AttestableEntity };
