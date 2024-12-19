/**
 * ReChunk Configuration which is stored in the .rechunkrc.json file in the root of a React Native project.
 *
 * {@link https://crherman7.github.io/rechunk/guides/chunks/}
 */
type ReChunkConfig = {
  /**
   * The name of the project
   *
   * @example
   *
   * "prototypical-pigs-interlay"
   */
  project: string;

  /**
   * The read key for accessing the project
   *
   * @example
   *
   * "read-5456fcad-99bd-4328-bfc4-0cb597ffbc4d"
   */
  readKey: string;

  /**
   * The write key for accessing the project
   *
   * @example
   *
   * "write-9bd47fc2-323e-4f74-9082-2abfb86582b4"
   */
  writeKey: string;

  /**
   * The public key associated with the project
   *
   * @example
   *
   * "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArk92wo3nc7AShy2c860h\nojRACKTnYGbB1NPRezyZ40Lk9p/myZ02ZpmVDGlMtWgqgIOoufUwPTa9LkmjFUgg\nYkhDHZzokiJjZ9PseRXr4+63p8MSvOmQvoQMqSO2mBEuXTks4tTNx/AySWqV9GDC\nMeM+VFKtQULuxgQSNJ1LDIu8ofpeKDB2bivV8phrLzRSM4TWuCu9u9gWxsUbTihR\nLyicJvmx44NBmdr9N0WIOh/15vAYieiY8MsZE7B8St0x5jgDT4taUzTd8R0RyDw/\nOtpCeOIDGwmz7h0Rx2r0Q+WOuRL4MSbGBJuT3TJoWkOPCrhfH3Sc6a61NyoPeiDZ\nXQIDAQAB\n-----END PUBLIC KEY-----\n"
   */
  publicKey: string;

  /**
   * The private key associated with the project
   *
   * @example
   *
   * "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuT3bCjedzsBKH\nLZzzrSGiNEAIpOdgZsHU09F7PJnjQuT2n+bJnTZmmZUMaUy1aCqAg6i59TA9Nr0u\nSaMVSCBiSEMdnOiSImNn0+x5Fevj7renwxK86ZC+hAypI7aYES5dOSzi1M3H8DJJ\napX0YMIx4z5UUq1BQu7GBBI0nUsMi7yh+l4oMHZuK9XymGsvNFIzhNa4K7272BbG\nxRtOKFEvKJwm+bHjg0GZ2v03RYg6H/Xm8BiJ6JjwyxkTsHxK3THmOANPi1pTNN3x\nHRHIPD862kJ44gMbCbPuHRHHavRD5Y65EvgxJsYEm5PdMmhaQ48KuF8fdJzprrU3\nKg96INldAgMBAAECggEAQfVhzAbkYRtsN2ikLnUB+B3raRn1T74ydHVenFJ3LM7g\nUw54xyvNLQ/KnbKuyypKguzPCOblxRQUjBJjOqdbUbVkaC06uCl5Eg3YOo14AH0R\nU9L2ITQEiILxQ4N3EZ3WvIHpIUBDSffzH2LMsXd3pGcH6+KJGtvX/GgH947Zmjoa\nXOiu3hw+E1qZaUTjWgGYmT+ph+8gHW34ner5JS4m8tqkNtP0U2DJIVD7MR5i/jp3\nzv19/foEUew8wvs4R4GcvS3xGETebg4H6DonxJ79HtXe3jzigreOLYybjyw4zRFv\nYHDh9qRCL20Qydq7Ogg963Yur1Ecys2faeehNp8pxQKBgQDUNreN8wMYU4/qyLmi\n7wHQ9rr/pqqcNsLsBRSlwXKsK7ffwSjvx+aUOzucnlHUrLpJtllT551aWw8EY4Rx\nGI7iTwCPCKK7s6laZeXSrSKWgXibTuCn/1FJ8dZbFHKhWaXQW2QFSSNRzqp41FhB\ncZXs9cS0Yf6issvtiP7hAX7N/wKBgQDSRqpdl/eX2t4vMYbdfHvvtzy01MccKrQ2\nhADX/PgVAe/8n1/vxftK5cKAUapq0gpS8/1mRuTeRZ9a7HAZvpNuYEKhlRsSOzNg\nYYqNmq9F33kxRjsdm6RrYMMyk8v8pIuyFTaZY+MdIRDt306a2VK4EAQxS5G+wTr6\nOgOM4fxQowKBgGawZ5gf7PJ7lRu2r+XBJC7bBdgp7UsUULRnLPucpYHc0ehLjySg\npdo643jBP7XbM3Xx8D3iyUjs4VJtWaxkhtfKBOox8pVDtgKRZmnQ7/jGg/cbbyi8\nKrjOdryyI1oiiFNPthG8t4OhruozTtW0QildMCddeBuAy5+Q+E0nLRY/AoGAFxXR\nAGN9uDs8J1w9nTVcee3ZCVVO4sXBcTa+zPel2NCUo1xv8OgAdbGRz/qnRgD3RzIo\nQMFJwSlNnHLWv8zPbM++oPS4uyCqvEsZJgC0e2xUZtd6B/8dZviBlZzqSTtbZtqz\nWtW/imQl8qeQfqmbTj/b5fmQ76tRKUWTPDVXORcCgYEArx0LII/G1luLj/z2bvhz\nA5OXyUL7ka2wJqmpb0XdFP+PPIsud5GXf2uG9GTkhBHnwuakXW8UdB/4pwEtAYRS\nGndITg+KPDwTvuz6P51MQM6wd1922UKjTl3BY+7CzaWCuBGV/yfFjpsWtoSQJvSY\nDCwpHpF7v/6fhQU/Y2ZnI84=\n-----END PRIVATE KEY-----\n"
   */
  privateKey: string;

  /**
   * External resources related to the project; an array of strings
   *
   * @example
   *
   * ```json
   * ["@/shared"]
   * ```
   */
  external: string[];

  /**
   * The host for the project
   *
   * @example
   *
   * "http://localhost:3000"
   */
  host: string;
};
