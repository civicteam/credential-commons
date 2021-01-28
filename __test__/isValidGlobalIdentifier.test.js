const { initialize } = require('../src');

const isGlobalIdentifier = require('../src/isValidGlobalIdentifier');

beforeAll(initialize);

describe('isGlobalIdentifier Tests', () => {
  test('name-v1 is malformed', () => {
    const shouldFail = () => isGlobalIdentifier('name-v1');
    expect(shouldFail).toThrow(/Invalid identifier/);
  });
  test('credentialItem-civ:Identity:firstName-1 has invalid prefix', () => {
    const shouldFail = () => isGlobalIdentifier('credentialItem-civ:Identity:firstName-1');
    expect(shouldFail).toThrow(/Invalid identifier/);
  });
  test('claim-civ:Identity:firstNome-1 is invalid', () => {
    const shouldFail = () => isGlobalIdentifier('claim-civ:Identity:firstNome-1');
    expect(shouldFail).toThrow(/Invalid identifier/);
  });
  test('credential-civ:Credential:CivicBasico-1 is invalid', () => {
    const shouldFail = () => isGlobalIdentifier('credential-civ:Credential:CivicBasico-1');
    expect(shouldFail).toThrow(/Invalid identifier/);
  });
  test('valid format but missing claim schema', () => {
    const shouldFail = () => isGlobalIdentifier('claim-something:unknown-v1');
    expect(shouldFail).toThrow(/No schema found/);
  });
  test('claim-cvc:Name.givenNames-v1 is valid', () => {
    expect(isGlobalIdentifier('claim-cvc:Identity.name.givenNames-v1')).toBeTruthy();
  });
  test('credential-cvc:IDVaaS-v1 is valid', () => {
    expect(isGlobalIdentifier('credential-cvc:IDVaaS-v1')).toBeTruthy();
  });
  test('credential-cvc:IdDocument-v2 is valid', () => {
    expect(isGlobalIdentifier('credential-cvc:IdDocument-v2')).toBeTruthy();
  });
});
