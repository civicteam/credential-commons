const { AttestableEntity } = require('./AttestableEntity');

const attestableValueRegex = /^urn:(\w+(?:\.\w+)*):(\w+):(.+)/;

const isNotNull = (value) => value !== null;

class Claim extends AttestableEntity {
  static parseAttestableValue(value) {
    if (!value || !value.attestableValue) throw new Error('Missing attestableValue');

    const splitPipes = value.attestableValue.split('|');

    const attestableValues = splitPipes.map((stringValue) => {
      const match = attestableValueRegex.exec(stringValue);
      if (match && match.length === 4) {
        return {
          propertyName: match[1],
          salt: match[2],
          value: match[3],
          stringValue,
        };
      }

      return null;
    }).filter(isNotNull);

    if (splitPipes.length !== attestableValues.length && splitPipes.length !== attestableValues.length + 1) {
      throw new Error('Invalid attestableValue');
    }

    return attestableValues;
  }
}

module.exports = { Claim };
