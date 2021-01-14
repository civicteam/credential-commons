/* eslint-disable global-require,import/no-dynamic-require */

/**
 * Imports and validates JSON Schema objects
 */

const path = require('path');
const fs = require('fs');
const Ajv = require('ajv').default;
const traverse = require('json-schema-traverse');
const addFormats = require('ajv-formats').default;

const basePath = '../../../schemas';

const ajv = new Ajv({
  logger: console,
  allErrors: true,
  verbose: true,
});
// add data formats such as date-time
addFormats(ajv);

// load a schema from a path into ajv if not already loaded
const loadSchema = (schemaPath) => {
  const schema = require(schemaPath);
  if (!ajv.schemas[schema.$id]) {
    ajv.addSchema(schema);
  }
};

/**
 * Find and load the schema associated with this identifier.
 * Mutates the ajv object.
 *
 * If the identifier is a subschema e.g. Identity.name.givenName, then the schema used will be Identity.name
 *
 * @param identifier {Identifier}
 */
const loadSchemaForIdentifier = (identifier) => {
  // generate a schema path based on an identifier and a name.
  // The name may be a substring of the identifier.name object
  const loadByName = (name) => {
    const schemaPath = path.join(basePath, identifier.type, identifier.version, `${identifier.type}-${name}.schema.json`);
    loadSchema(schemaPath);
    return require(schemaPath);
  };

  const nameSegments = identifier.name.split('.');

  // for each name segment, e.g. a.b.c.d, attempt to find the schema matching that segment
  // start with a. If found, stop, if not move to a.b etc
  return nameSegments.reduce((lastFoundSchemaAttempt, nextNameSegment) => {
    const { foundSchema, lastName } = lastFoundSchemaAttempt;
    if (foundSchema) return lastFoundSchemaAttempt; // short-circuit. No need to keep looking

    // create the next name segment by appending the previous name used with the next name segment
    const nextName = lastName ? `${lastName}.${nextNameSegment}` : nextNameSegment;

    try {
      // attempt to load the schema. If found, we are done
      const schema = loadByName(nextName);
      return { foundSchema: schema, lastName: nextName };
    } catch (error) {
      // if an error occurred, check if it is because the schema was not found.
      // If so, move on to the next name segment. Otherwise, abort and throw the error
      if (error.code === 'MODULE_NOT_FOUND') {
        return { foundSchema: null, lastName: nextName };
      }

      throw error;
    }
  }, { foundSchema: null, lastName: '' });
};

// Find and preload all type definitions for a given version
const loadTypes = () => {
  const typeVersionsPath = path.join(basePath, 'type');
  const versionDirs = fs.readdirSync(path.join(__dirname, typeVersionsPath));
  versionDirs.forEach((versionPath) => {
    const typesPath = path.join(basePath, 'type', versionPath);
    const typeFiles = fs.readdirSync(path.join(__dirname, typesPath));
    typeFiles.forEach((typeFile) => {
      const typePath = path.join(typesPath, typeFile);
      loadSchema(typePath);
    });
  });
};

/**
 * For a given identifier, load its related schema and a reference to the part of it that this identifier uses.
 * E.g. if the identifier is claim-cvc:Identity.name-v1, load the schema claim-cvc:Identity.name-v1.
 * If the identifier is claim-cvc:Identity.name.givenName-v1,
 * load the schema claim-cvc:Identity.name-v1 and a reference
 * to http://identity.com/schemas/type-cvc:Name-v1#/definitions/name/properties/givenName
 *
 * This is used to allow claims of subschema without needing a schema for each property.
 * @param parsedIdentifier {Identifier}
 * @return {{schema: ({foundSchema}|*), parsedIdentifier: Identifier, ref: string}}
 */
const loadSchemaObject = (parsedIdentifier) => {
  const schemaLoader = loadSchemaForIdentifier(parsedIdentifier);
  if (!schemaLoader.foundSchema) throw new Error(`No schema found for ${parsedIdentifier.identifier}`);

  loadTypes(parsedIdentifier.version);

  const { foundSchema: schema, lastName } = schemaLoader;

  let ref = schema.$id;
  if (lastName !== parsedIdentifier.name) {
    // a property of the loaded schema is mapped to a definition in a type file.
    // Ajv does not traverse these when performing validations of subschemas
    // So the refMap allows us to find the correct location to validate a subschema.
    const refMap = {};
    traverse(schema, {
      cb: (currentNode, currentPath, currentSchema, parent, nodeName) => {
        if (nodeName === 'allOf') {
          refMap[schema.$id] = currentNode.$ref;
        }
      },
    });

    const subPath = parsedIdentifier.name.replace(lastName, '').replace(/\./g, '/');

    ref = `${refMap[schema.$id]}/properties${subPath}`;
  }

  return {
    ref,
    schema,
    parsedIdentifier,
  };
};

const validate = (schemaRef, value) => {
  const validateSchema = ajv.getSchema(schemaRef);
  const valid = validateSchema(value);

  if (!valid) throw new Error(`Invalid value. Errors: ${JSON.stringify(validateSchema.errors)}`);
};

module.exports = { loadSchemaObject, validate };
