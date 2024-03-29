import {HonoRequest} from 'hono';

const CREDENTIALS_REGEXP =
  /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;
const USER_PASS_REGEXP = /^([^:]*):(.*)$/;
const utf8Decoder = new TextDecoder();

const decodeBase64 = (str: string): Uint8Array => {
  const binary = atob(str);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  const half = binary.length / 2;
  for (let i = 0, j = binary.length - 1; i <= half; i++, j--) {
    bytes[i] = binary.charCodeAt(i);
    bytes[j] = binary.charCodeAt(j);
  }
  return bytes;
};

export const auth = (req: HonoRequest) => {
  const match = CREDENTIALS_REGEXP.exec(req.header('Authorization') || '');
  if (!match) {
    return undefined;
  }

  let userPass = undefined;
  // If an invalid string is passed to atob(), it throws a `DOMException`.
  try {
    userPass = USER_PASS_REGEXP.exec(
      utf8Decoder.decode(decodeBase64(match[1])),
    );
  } catch {} // Do nothing

  if (!userPass) {
    return undefined;
  }

  return {username: userPass[1], password: userPass[2]};
};
