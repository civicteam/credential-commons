const Ajv = require('ajv').default
const schema = require('../schemas/claim/1/claim-cvc:Identity.address.schema.json');

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
const validate = ajv.compile(schema)
// const valid = validate(data)
// if (!valid) console.log(validate.errors)
