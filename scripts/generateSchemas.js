/* eslint-disable no-console */
const claimDefinitions = require('../src/claim/definitions');
const credentialDefinitions = require('../src/creds/definitions');
const {pascalToCamelCase} = require('../src/lib/stringUtils');
const schemaGenerator = require('../src/schemas/generator/SchemaGenerator');
const { Claim, getBaseIdentifiers } = require('../src/claim/Claim');
const { UserCollectableAttribute: UCA, definitions: ucaDefinitions } = require('@identity.com/uca');
const VC = require('../src/creds/VerifiableCredential_old');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const fs = require('fs');
const shell = require('shelljs');

// static variables only for the CLI, not used in any other place
const GENERATION_FOLDER = 'dist/schemas';
// https://stackoverflow.com/questions/9391370/json-schema-file-extension
const SCHEMA_FILE_EXTENSION = '.schema.json';

/**
 * Defined options for the Schema Generator Claim/Credentials or Both
 */
const askOptions = () => {
  const questions = [
    {
      type: 'list',
      name: 'value',
      message: 'Which schema do you want to generate?',
      choices: ['UCAs and Claims', 'Credentials', 'Both'],
      filter: val => val.toLowerCase(),
    },
  ];
  return inquirer.prompt(questions);
};

/**
 * Generate the JSON from an Claim Identifier than generate it's schema saving it on the file system
 * @returns {Promise<void>}
 */
const generateUcaSchemas = async () => {
  claimDefinitions.forEach((definition) => {
    if (definition.credentialItem) {
      generateSchemaForDefinition(definition, definition.identifier.replace(/-v.*$/, ''), 'claim');
    }
  });

  ucaDefinitions.forEach((definition) => {
    generateSchemaForDefinition(definition, `uca-${definition.identifier}`, 'uca');
  });
};

const generateSchemaForDefinition = (definition, fileName, typeOfDefinition) => {
  const json = schemaGenerator.buildSampleJson(definition, true);
  console.log(json);
  const jsonSchema = schemaGenerator.process(definition, json);
  console.log(jsonSchema);
  const jsonFolderVersion = `${definition.version}`;
  const folderPath = `${GENERATION_FOLDER}/${typeOfDefinition}/${jsonFolderVersion}`;
  if (!fs.existsSync(folderPath)) {
    shell.mkdir('-p', folderPath);
  }
  const filePath = `${fileName}${SCHEMA_FILE_EXTENSION}`;
  const fullPath = `${folderPath}/${filePath}`;
  fs.writeFile(fullPath, JSON.stringify(jsonSchema, null, 2), (err) => {
    if (err) throw err;
    console.log(`Json Schema generated on:${fullPath}`);
  });
}

/**
 * Generate a Credential using the definition and its correlated Claims, then generate the schema, saving it on the file system
 * @returns {Promise<void>}
 */
const generateCredentialSchemas = async () => {
  const promises = credentialDefinitions.map(async (definition) => {
    const ucaArray = [];
    const jsonValueDefinitions = {};

    definition.depends.forEach((ucaDefinitionIdentifier) => {
      const ucaDefinition = claimDefinitions.find(ucaDef => ucaDef.identifier === ucaDefinitionIdentifier);
      const ucaJson = schemaGenerator.buildSampleJson(ucaDefinition, true);
      const copyUcaWithDefinitions = JSON.parse(JSON.stringify(ucaJson));
      const { identifierComponents } = getBaseIdentifiers(ucaDefinitionIdentifier);
      delete ucaJson.definition;

      Object.keys(ucaJson).forEach((prop) => {
        delete ucaJson[prop].definition;
      });

      let value = ucaJson;
      if (Object.keys(ucaJson).length === 1) {
        value = Object.values(ucaJson)[0];
      }
      jsonValueDefinitions[identifierComponents[2]] = copyUcaWithDefinitions;
      const dependentUca = new Claim(ucaDefinition.identifier, value, ucaDefinition.version);
      ucaArray.push(dependentUca);
    });
    const credential = new VC(definition.identifier, 'jest:test', null, ucaArray);

    definition.depends.forEach((ucaDefinitionIdentifier) => {
      const { identifierComponents } = getBaseIdentifiers(ucaDefinitionIdentifier);
      try {
        credential.claim[pascalToCamelCase(identifierComponents[1])][identifierComponents[2]] = jsonValueDefinitions[identifierComponents[2]];
      } catch (error) {
        console.warn('Error adding dependency ' + ucaDefinitionIdentifier, error);
        throw error;
      }
    });

    await credential.requestAnchor();
    await credential.updateAnchor();
    const jsonString = JSON.stringify(credential, null, 2);
    const generatedJson = JSON.parse(jsonString);
    const jsonSchema = schemaGenerator.process(credential, generatedJson);
    const jsonFolderVersion = `${definition.version}`;
    const fileName = definition.identifier.replace(/-v.*$/, '');
    const folderPath = `${GENERATION_FOLDER}/credentials/${jsonFolderVersion}`;
    if (!fs.existsSync(folderPath)) {
      shell.mkdir('-p', folderPath);
    }
    const filePath = `${fileName}${SCHEMA_FILE_EXTENSION}`;
    const fullPath = `${folderPath}/${filePath}`;
    fs.writeFile(fullPath, JSON.stringify(jsonSchema, null, 2), (err) => {
      if (err) throw err;
      console.log(`Json Schema generated on:${fullPath}`);
    });
  });

  await Promise.all(promises);
};

const generateBoth = async () => {
  await generateUcaSchemas();
  await generateCredentialSchemas();
};

const generate = async () => {
  if (!process.env.NODE_ENV) {
    clear();
    console.log(
      chalk.green(
        figlet.textSync('CIVIC', { horizontalLayout: 'full' }),
      ),
    );
    const selectedOption = await askOptions();
    if (selectedOption.value === 'uca') {
      await generateUcaSchemas();
    } else if (selectedOption.value === 'credentials') {
      await generateCredentialSchemas();
    } else {
      await generateBoth();
    }
  } else {
    await generateBoth();
  }
};

generate().catch(error => {
  console.error(error);
  process.exit(1)
});

