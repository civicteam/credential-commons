const DEFAULT_BUILDER = require('../schemas/loader/jsonSchemaLoader');

// eslint-disable-next-line no-useless-escape
const validIdentifier = (identifier) => identifier.match(/(claim|credential|uca)-\w+:[\w\.]+-v\d+/);

class ParsedIdentifier {
  constructor(identifier, builder = DEFAULT_BUILDER) {
    if (!validIdentifier(identifier)) throw new Error(`Invalid identifier ${identifier}`);

    const [type, name, versionString] = identifier.split('-');

    // store the original form (primarily for logging etc)
    this.identifier = identifier;
    this.type = type;
    this.name = name;
    this.version = versionString.replace(/^v/, ''); // remove the 'v' from the version
    this.schemaInformation = builder.loadSchemaObject(this);
  }
}
module.exports = { ParsedIdentifier };
