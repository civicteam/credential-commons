// eslint-disable-next-line no-useless-escape
const validIdentifier = (identifier) => identifier.match(/claim-\w+:[\w\.]+-v\d+/);

class Identifier {
  constructor(identifier) {
    if (!validIdentifier(identifier)) throw new Error(`Invalid identifier ${identifier}`);
    const [type, name, versionString] = identifier.split('-');

    this.type = type;
    this.name = name;
    this.version = versionString.replace(/^v/, ''); // remove the 'v' from the version
  }
}
module.exports = { Identifier };
