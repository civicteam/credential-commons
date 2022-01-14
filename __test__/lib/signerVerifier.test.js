const nacl = require('tweetnacl');
const { TextEncoder } = require('util');
const signerVerifier = require('../../src/lib/signerVerifier');
const {
  mockDids,
  DID_SPARSE,
  privateKeyBase58,
  keyPair,
} = require('./util/did');

const textEncoder = new TextEncoder();

const DUMMY_MERKLE_ROOT = 'aa4149dda8fd2fac435898372f1de399140f6c50dbc3d40585c913701ce902c4';

describe('signerVerifier', () => {
  beforeAll(mockDids);

  it('creates a signer from a private key', async () => {
    const privateKey = privateKeyBase58(DID_SPARSE);
    const verificationMethod = `${DID_SPARSE}#default`;

    const signer = await signerVerifier.signer({
      verificationMethod,
      privateKey,
    });

    const signed = signer.sign({ merkleRoot: SIGN_DATA });

    expect(signed).toBeTruthy();

    const verifier = await signerVerifier.verifier(DID_SPARSE, verificationMethod);
    const verified = verifier.verify({
      issuer: DID_SPARSE,
      proof: {
        merkleRoot: SIGN_DATA,
        merkleRootSignature: signed,
      },
    });

    expect(verified).toBe(true);
  });

  it('creates a signer from a keypair', async () => {
    const keypair = keyPair(DID_SPARSE);
    const verificationMethod = `${DID_SPARSE}#default`;

    const signer = await signerVerifier.signer({
      verificationMethod,
      keypair,
    });

    const signed = signer.sign({ merkleRoot: DUMMY_MERKLE_ROOT });

    expect(signed).toBeTruthy();

    const verifier = await signerVerifier.verifier(DID_SPARSE, verificationMethod);
    const verified = verifier.verify({
      issuer: DID_SPARSE,
      proof: {
        merkleRoot: SIGN_DATA,
        merkleRootSignature: signed,
      },
    });

    expect(verified).toBe(true);
  });

  it('uses a provided signer', async () => {
    const verificationMethod = `${DID_SPARSE}#default`;
    const keypair = keyPair(DID_SPARSE);

    const customSigner = {
      sign(proof) {
        const encodedData = textEncoder.encode(proof.merkleRoot);

        const signature = nacl.sign.detached(encodedData, keypair.secretKey);

        return {
          signature,
          verificationMethod,
        };
      },
    };

    const signer = await signerVerifier.signer({
      verificationMethod,
      signer: customSigner,
    });

    const signed = signer.sign({ merkleRoot: DUMMY_MERKLE_ROOT });

    expect(signed).toBeTruthy();

    const verifier = await signerVerifier.verifier(DID_SPARSE, verificationMethod);
    const verified = verifier.verify({
      issuer: DID_SPARSE,
      proof: {
        merkleRoot: SIGN_DATA,
        merkleRootSignature: signed,
      },
    });

    expect(verified).toBe(true);
  });
});
