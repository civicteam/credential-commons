const DEFAULT_BUILDER = require('../schema/loader/jsonSchemaLoader');

// eslint-disable-next-line no-useless-escape
const validIdentifier = (identifier) => identifier.match(/(claim|credential|uca)-\w+:[\w\.]+-v\d+/);

class ParsedIdentifier {
  // The original form of the identifier
  get identifier() {
    return `${this.type}-${this.name}-v${this.version}`;
  }

  constructor(identifier, builder = DEFAULT_BUILDER) {
    if (!validIdentifier(identifier)) throw new Error(`Invalid identifier ${identifier}`);

    const [type, name, versionString] = identifier.split('-');

    this.type = type;
    this.name = name;
    this.version = versionString.replace(/^v/, ''); // remove the 'v' from the version
    this.schemaInformation = builder.loadSchemaObject(this);
  }
}
module.exports = { ParsedIdentifier };
