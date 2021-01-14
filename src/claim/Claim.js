const path = require('path');
const Ajv = require('ajv').default;

const basePath = '../../schemas';

class Claim {
  constructor(claimName, data) {
    const [type, name, version] = claimName.split('-');
    const versionNumber = version.replace(/^v/, ''); // remove the 'v' from the version
    const schemaPath = path.join(basePath, type, versionNumber, `${type}-${name}.schema.json`);

    // TODO load in bulk, load from remote etc
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const schema = require(schemaPath);

    const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) throw new Error('Invalid data'); // TODO send a specific error type
    this.data = data;
  }
}

module.exports = { Claim };
