const DEFAULT_BUILDER = require('../schema/jsonSchema');
const { parseIdentifier } = require('../lib/stringUtils');

const DEFAULT_URI = 'http://identity.com/schemas/';

const attestableMetaClaims = [
  'claim-cvc:Meta.issuer-v1',
  'claim-cvc:Meta.issuanceDate-v1',
  'claim-cvc:Meta.expirationDate-v1',
];

class ParsedIdentifier {
  // The original form of the identifier
  get identifier() {
    return `${this.type}-${this.name}-v${this.version}`;
  }

  constructor(identifier, uriPrefix = DEFAULT_URI, builder = DEFAULT_BUILDER) {
    const components = parseIdentifier(identifier);
    if (!components) throw new Error(`Invalid identifier ${identifier}`);
    const [, type, name, version] = components;

    this.type = type;
    this.name = name;
    this.version = version;
    this.schemaInformation = builder.loadSchemaObject(uriPrefix + identifier);
    // TODO: Rename to `provable` at some point
    this.attestable = attestableMetaClaims.includes(identifier);
  }
}

ParsedIdentifier.fromURI = (
  uri, builder = DEFAULT_BUILDER,
) => new ParsedIdentifier(parseIdentifier(uri)[0], builder);

module.exports = { ParsedIdentifier };
