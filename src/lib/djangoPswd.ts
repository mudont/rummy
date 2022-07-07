import crypto from "crypto";
import Debug from "debug";
const debug = Debug("app:script");
// const myHashed =
//   "pbkdf2_sha256$150000$tV1BwNdmqG50$I6RJseAHzplfwY+DNnvodoEOa6LbdZHKZeA42xDAGG4=";
const password = "murali";
// pbkdf2_sha256$100000$Um5UH96Ly68=$NlP9YE4Ovt4BSDdSI8OBwYrPLlVFXaLGZS6CxHEIkvE=
const digest = "sha256";
const iterations = 150000;
const keyLength = 32;
const saltSize = 8;

export const hash = (password: string) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(saltSize, (error, salt) => {
      if (error) {
        return reject(error);
      }
      const salt_ = Buffer.from(salt).toString("base64");
      crypto.pbkdf2(
        password,
        salt_,
        iterations,
        keyLength,
        digest,
        (error, derivedKey) => {
          if (error) {
            return reject(error);
          }
          resolve(
            `pbkdf2_${digest}$${iterations}$${salt_}$${derivedKey.toString(
              "base64"
            )}`
          );
        }
      );
    });
  });
};

export const verify = (password: string, hash: string) => {
  return new Promise((resolve, reject) => {
    try {
      const arrHash = hash.split("$");

      const digest = arrHash[0].split("_")[1];
      const iterations = +arrHash[1]; // number
      const salt = arrHash[2];
      const key = arrHash[3];

      crypto.pbkdf2(
        password,
        salt,
        iterations,
        keyLength,
        digest,
        (error, derivedKey) => {
          if (error) {
            return reject(error);
          }
          resolve(derivedKey.toString("base64") === key);
        }
      );
    } catch (error) {
      return reject(error);
    }
  });
};

export function test(): void {
  debug(`password=${password}`);
  hash(password)
    .then((hash_: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const hash: string = hash_.toString();
      debug("Hashed: ", hash);

      verify(password, hash)
        .then((result) => {
          debug("Verify: ", result);
        })
        .catch((err) => debug(err));
    })
    .catch((err) => debug(err));
}
