import {HonoRequest} from 'hono';
import {HTTPException} from 'hono/http-exception';

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
    throw new HTTPException(400, {
      message: 'auth middleware missing basic auth',
    });
  }

  let userPass;
  // If an invalid string is passed to atob(), it throws a `DOMException`.
  try {
    userPass = USER_PASS_REGEXP.exec(
      utf8Decoder.decode(decodeBase64(match[1])),
    );
  } catch {} // Do nothing

  if (!userPass) {
    throw new HTTPException(401, {
      message: 'auth middleware contains "username" and "password" mismatch',
    });
  }

  return {username: userPass[1], password: userPass[2]};
};
