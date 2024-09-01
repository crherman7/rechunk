import {KJUR} from 'jsrsasign';

/**
 * Creates a hash generator function using the specified algorithm.
 *
 * @param algorithm - The hash algorithm to use (e.g., "sha256").
 * @returns A function that generates a hash for the given data.
 */
const createHashGenerator = (algorithm: string) => {
  /**
   * Generates a hash for the provided data.
   *
   * @param data - The data to hash.
   * @returns The hexadecimal representation of the hash.
   * @example
   * const hash = createHashGenerator('sha256')('data to hash');
   * console.log(hash); // Outputs the SHA-256 hash of the data
   */
  return (data: string): string => {
    const md = new KJUR.crypto.MessageDigest({alg: algorithm});
    md.updateString(data);

    return md.digest();
  };
};

/**
 * Creates a JWS verifier function using the specified algorithm and public key.
 *
 * @param algorithm - The signing algorithm to use (e.g., "RS256").
 * @param publicKey - The RSA public key for verification.
 * @returns An object containing functions to verify and decode a JWS.
 */
const createJWSVerifier = (algorithm: string, publicKey: string) => {
  /**
   * Verifies the provided JWS.
   *
   * @param jwsString - The JWS to verify.
   * @returns True if the JWS is valid, otherwise false.
   * @example
   * const isValid = createJWSVerifier('RS256', publicKey).verify(jwsString);
   * console.log(isValid); // Outputs true or false
   */
  const verify = (jwsString: string): boolean => {
    return KJUR.jws.JWS.verify(jwsString, publicKey, [algorithm]);
  };

  /**
   * Decodes the provided JWS without verifying its signature.
   *
   * @param jwsString - The JWS to decode.
   * @returns The decoded JWS object.
   * @example
   * const decoded = createJWSVerifier('RS256', publicKey).decode(jwsString);
   * console.log(decoded); // Outputs the decoded JWS object
   */
  const decode = (jwsString: string) => {
    return KJUR.jws.JWS.parse(jwsString);
  };

  return {verify, decode};
};

/**
 * Creates an integrity checker that can generate and verify hashes and JWS.
 *
 * @param hashAlgorithm - The hash algorithm to use (e.g., "sha256").
 * @param jwsAlgorithm - The signing algorithm to use (e.g., "RS256").
 * @param publicKey - The RSA public key for verification.
 * @returns An object containing functions to generate hashes and verify integrity.
 */
export const createIntegrityChecker = (
  hashAlgorithm: string,
  jwsAlgorithm: string,
  publicKey: string,
) => {
  const generateHash = createHashGenerator(hashAlgorithm);
  const {verify: verifyJWS, decode: decodeJWS} = createJWSVerifier(
    jwsAlgorithm,
    publicKey,
  );

  /**
   * Verifies the integrity of the provided data using JWS.
   *
   * @param data - The data to verify.
   * @param jwsString - The JWS to use for verification.
   * @returns True if the data's hash matches the hash in the JWS, otherwise false.
   * @example
   * const isValid = createIntegrityChecker('sha256', 'RS256', publicKey).verify(fileContent, jwsString);
   * console.log(isValid); // Outputs true or false
   */
  const verify = (data: string, jwsString: string): boolean => {
    if (!verifyJWS(jwsString)) {
      return false;
    }
    const decoded = decodeJWS(jwsString);
    const expectedHash = decoded.payloadPP;
    const actualHash = generateHash(data);

    return expectedHash === actualHash;
  };

  return {generateHash, verify};
};
