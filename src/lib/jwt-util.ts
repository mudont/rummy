import randomString from "randomstring";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { MyRequest } from "src/types";
import { NextFunction, Request } from "express";
import Debug from "debug";
import { User } from "@prisma/client";
import userSvc from "@services/user-service";
const debug = Debug("app:jwtUtil");

// Errors
const errors = {
  validation: "JSON-web-token validation failed.",
} as const;

// Constants
const secret = process.env.JWT_SECRET || randomString.generate(100),
  options = { expiresIn: process.env.COOKIE_EXP };

// Types
type TDecoded = string | JwtPayload | undefined;

/**
 * Encrypt data and return jwt.
 *
 * @param data
 */
function sign(data: JwtPayload): Promise<string> {
  return new Promise((resolve, reject) => {
    jsonwebtoken.sign(data, secret, options, (err, token) => {
      err ? reject(err) : resolve(token || "");
    });
  });
}
function signSync(data: JwtPayload): string {
  return jsonwebtoken.sign(data, secret, options);
}

/**
 * Decrypt JWT and extract client data.
 *
 * @param jwt
 */
function decode(jwt: string, my_secret?: string): Promise<TDecoded> {
  return new Promise((res, rej) => {
    jsonwebtoken.verify(jwt, my_secret || secret, (err, decoded) => {
      return err ? rej(errors.validation) : res(decoded);
    });
  });
}
function decodeSync(jwt: string): TDecoded {
  return jsonwebtoken.verify(jwt, secret);
}

// function verify(jwt_payload: string, done: NextFunction) {
//   decode(jwt_payload).then(done(null, error, info));
// }

const cookieExtractor = function (req: Request): string | undefined {
  let token;
  if (req && req.cookies) {
    token = req.cookies["jwt"] as string;
  }
  return token;
};

function authHeaderToJwt(hdr: string): string {
  let jwt = "";
  if (hdr && hdr.startsWith("Bearer ")) {
    jwt = hdr.split(" ")[1];
  }
  return jwt;
}
export function authHeaderToUser(auth: string): User | null {
  const jwt = authHeaderToJwt(auth);
  if (jwt) {
    let profile;
    try {
      profile = decodeSync(jwt);
    } catch (e: any) {
      return null;
    }
    return userSvc.profileToUser(profile as Record<string, any>) as User;
  } else {
    return null;
  }
}

export function getBearerToken(req: Request): string {
  return authHeaderToJwt(req.headers.authorization ?? "");
}
// Export default
export default {
  cookieExtractor,
  sign,
  decode,
  secret,
  signSync,
  decodeSync,
  getBearerToken,
  authHeaderToUser,
  //verify,
};
