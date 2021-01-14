const { UserCollectableAttribute } = require('@identity.com/uca');
const { Claim } = require('../../src/claim/Claim');

const nameClaimData = {
  givenNames: 'Max',
  otherNames: 'Paul',
  familyNames: 'von und zu Mustermann',
};

describe('UCA Constructions tests', () => {
  test('cvc:Verify:phoneNumberToken must have type equals String', () => {
    const identifier = 'cvc:Verify:phoneNumberToken';
    const value = '12345';
    const v = new Claim(identifier, value);
    expect(v).toBeDefined();
    expect(v.type).toEqual('String');
  });

  test('creation of Name must return type of object', () => {
    const identifier = 'claim-cvc:Identity.name-v1';
    const value = {
      givenNames: nameClaimData.givenNames,
    };
    const v = new Claim(identifier, value);
    expect(v.type).toEqual('Object');
  });

  test('creates claim-cvc:Identity.name-v1', () => {
    const identifier = 'claim-cvc:Identity.name-v1';
    const v = new Claim(identifier, nameClaimData);

    expect(v.value).toEqual(nameClaimData);
  });

  test('creates claim-cvc:Identity.name-v1 with multiple first names', () => {
    const identifier = 'claim-cvc:Identity.name-v1';
    const value = {
      givenNames: 'Max Paul',
      familyNames: nameClaimData.familyNames,
    };
    const v = new Claim(identifier, value);

    expect(v.value.givenNames).toEqual('Max Paul');
    expect(v.value.familyNames).toEqual(nameClaimData.familyNames);
  });

  test('Creating date of birth Claim successfuly', () => {
    const identifier = 'claim-cvc:Identity.dateOfBirth-v1';
    const value = {
      day: 20,
      month: 3,
      year: 1978,
    };
    const v = new Claim(identifier, value);
    expect(v).toBeDefined();
    expect(v.value.day.value).toBe(value.day);
    expect(v.value.month.value).toBe(value.month);
    expect(v.value.year.value).toBe(value.year);
  });

  test('Construct by NameGivenNames must result successfuly', () => {
    const v = new Claim.NameGivenNames(nameClaimData.givenNames);
    expect(v).toBeDefined();
    expect(v.value).toBe(nameClaimData.givenNames);
  });

  test('Construct IdentityName must result successfuly', () => {
    const v = new Claim.IdentityName(nameClaimData);
    expect(v).toBeDefined();
    expect(v.value.givenNames.value).toBe(nameClaimData.givenNames);
    expect(v.value.otherNames.value).toBe(nameClaimData.otherNames);
    expect(v.value.familyNames.value).toBe(nameClaimData.familyNames);
  });

  test('Claim should construct a complex Attestatble Value: claim-cvc:Identity.name-v1', () => {
    // eslint-disable-next-line max-len
    const aComplexAttestableValue = 'urn:name.familyNames:c443e0a97a2df34573f910927e25c58e597e211152dfb650e6210facacc1a065:Mustermann|urn:name.givenNames:f14ab211784a3b3d2f20d423847a775ad56c3be8104a51aa084f0c94756d953b:Max|urn:name.otherNames:09a31dab0a537ac5330a07df63effd9d2f55e91845956b58119843835f7dd9ed:Paul|';
    const v = new Claim.IdentityName({ attestableValue: aComplexAttestableValue });
    expect(v).toBeDefined();
  });

  test('Claim should create claim path correctly', () => {
    // eslint-disable-next-line max-len
    const aComplexAttestableValue = 'urn:name.familyNames:c443e0a97a2df34573f910927e25c58e597e211152dfb650e6210facacc1a065:Mustermann|urn:name.givenNames:f14ab211784a3b3d2f20d423847a775ad56c3be8104a51aa084f0c94756d953b:Max|urn:name.otherNames:09a31dab0a537ac5330a07df63effd9d2f55e91845956b58119843835f7dd9ed:Paul|';
    const v = new Claim.IdentityName({ attestableValue: aComplexAttestableValue });
    expect(v).toBeDefined();
    const claimPath = v.getClaimPath();
    expect(claimPath).toBe('identity.name');
  });

  test('Claim should return empty array when parsing wrong attestable value', () => {
    try {
      // eslint-disable-next-line max-len
      const aComplexAttestableValue = { attestableValue: 'buren:name.familyNames:c443e0a97a2df34573f910927e25c58e597e211152dfb650e6210facacc1a065:Mustermann|buren:name.givenNames:f14ab211784a3b3d2f20d423847a775ad56c3be8104a51aa084f0c94756d953b:Max|urn:name.otherNames:09a31dab0a537ac5330a07df63effd9d2f55e91845956b58119843835f7dd9ed:Paul' };
      Claim.parseAttestableValue(aComplexAttestableValue);
    } catch (e) {
      expect(e).toBeDefined();
      expect(e.message).toBe('Invalid attestableValue');
    }
  });

  test('Construct a cvc:Meta:expirationDate', () => {
    const identifier = 'cvc:Meta:expirationDate';
    const isoDate = '2018-06-20T13:51:18.640Z';
    const v = new Claim(identifier, isoDate);
    expect(v).toBeDefined();
  });

  test('Get global identifier of a Claim', () => {
    const identifier = 'cvc:Meta:expirationDate';
    const isoDate = '2018-06-20T13:51:18.640Z';
    const v = new Claim(identifier, isoDate);
    expect(v).toBeDefined();
    expect(v.getGlobalIdentifier()).toBe(`claim-${identifier}-1`);
  });

  test('Construct a claim-cvc:Contact.email-v1 Claim', () => {
    const identifier = 'claim-cvc:Contact.email-v1';
    const email = new Claim(identifier, { username: nameClaimData.givenNames, domain: { name: 'civic', tld: 'com' } });
    const plain = email.getPlainValue();
    expect(plain.username).toBe(nameClaimData.givenNames);
    expect(plain.domain).toBeDefined();
    expect(plain.domain.name).toBe('civic');
    expect(plain.domain.tld).toBe('com');
  });

  test('Construct a claim-cvc:Contact.phoneNumber-v1', () => {
    const identifier = 'claim-cvc:Contact.phoneNumber-v1';
    const phone = new Claim(identifier, {
      country: 'DE',
      countryCode: '49',
      number: '17225252255',
      lineType: 'mobile',
      extension: '111',
    });
    const plain = phone.getPlainValue();
    expect(plain.country).toBe('DE');
    expect(plain.countryCode).toBe('49');
    expect(plain.number).toBe('17225252255');
    expect(plain.extension).toBe('111');
    expect(plain.lineType).toBe('mobile');
  });

  test('Construct claim-cvc:Type.address-v1', () => {
    const identifier = 'claim-cvc:Type.address-v1';
    const address = new Claim(identifier, {
      country: 'DE',
      state: 'Berlin',
      county: 'Berlin',
      city: 'Berlin',
      postalCode: '15123',
      street: 'Ruthllardstr',
      unit: '12',
    });

    const plain = address.getPlainValue();
    expect(plain.country).toBe('DE');
    expect(plain.state).toBe('Berlin');
    expect(plain.county).toBe('Berlin');
    expect(plain.city).toBe('Berlin');
    expect(plain.unit).toBe('12');
    expect(plain.postalCode).toBe('15123');
    expect(plain.street).toBe('Ruthllardstr');
    expect(address.id).toBeDefined();
  });

  test('Should get ALL Claim properties email', () => {
    const properties = Claim.getAllProperties('claim-cvc:Contact.email-v1');
    expect(properties).toHaveLength(3);
    expect(properties).toContain('contact.email.username');
    expect(properties).toContain('contact.email.domain.name');
    expect(properties).toContain('contact.email.domain.tld');
  });

  test('Should get ALL Claim properties name', () => {
    const properties = Claim.getAllProperties('claim-cvc:Identity.name-v1');
    expect(properties).toHaveLength(3);
    expect(properties).toContain('identity.name.givenNames');
    expect(properties).toContain('identity.name.familyNames');
    expect(properties).toContain('identity.name.otherNames');
  });

  test('Claim with attestable value must constructed and parsed', () => {
    const identifier = 'claim-cvc:Address.country-v1';
    const attestableValue = {
      country: 'DE',
      state: 'Berlin',
      county: 'Berlin',
      city: 'Berlin',
      postalCode: '15123',
      street: 'Ruthllardstr',
      unit: '12',
      attestableValue: 'Mocked:asdkmalsdqasd',
    };
    const uca = new Claim(identifier, attestableValue);
    expect(uca).toBeDefined();
    expect(uca.value).toBeDefined();
  });

  test('Transforming UCA to Claim', () => {
    const identifier = 'cvc:Identity:dateOfBirth';
    const value = {
      day: 20,
      month: 12,
      year: 1978,
    };

    const dateOfBirthUCA = new UserCollectableAttribute(identifier, value);
    expect(dateOfBirthUCA).toBeDefined();
    expect(dateOfBirthUCA.value).toBeDefined();
    expect(dateOfBirthUCA.value.day).toBeDefined();
    expect(dateOfBirthUCA.value.day.value).toBe(20);

    // converting UCA to Claim
    const dateOfBirthClaim = new Claim(identifier, dateOfBirthUCA.getPlainValue());

    expect(dateOfBirthClaim).toBeDefined();
    expect(dateOfBirthClaim.value).toBeDefined();
    expect(dateOfBirthClaim.value.day).toBeDefined();
    expect(dateOfBirthClaim.value.day.value).toBe(20);
  });

  test('Transforming alias UCA to Claim', () => {
    const identifier = 'cvc:Document:evidences';
    const aliasIdentifier = 'cvc:Validation:evidences';
    const value = {
      idDocumentFront: { algorithm: 'sha256', data: 'sha256(idDocumentFront)' },
      idDocumentBack: { algorithm: 'sha256', data: 'sha256(idDocumentBack)' },
      selfie: { algorithm: 'sha256', data: 'sha256(selfie)' },
    };

    const evidencesUCA = new UserCollectableAttribute(identifier, value);
    const evidencesAliasUCA = new UserCollectableAttribute(aliasIdentifier, value);

    // converting UCAs to Claims
    const evidencesClaim = new Claim(identifier, evidencesUCA.getPlainValue());
    const evidencesClaimForAliasUCA = new Claim(aliasIdentifier, evidencesAliasUCA.getPlainValue());

    // should map to the same claim
    expect(evidencesClaimForAliasUCA.identifier).toEqual(evidencesClaim.identifier);
    expect(evidencesClaimForAliasUCA.getPlainValue()).toEqual(evidencesClaim.getPlainValue());
    expect(evidencesClaim.identifier).toBe('claim-cvc:Document.evidences-v1');
  });
});
