import { NextFunction, Request, Response, Router } from "express";
import type { MyRequest, MyResponse } from "../types";
import type { PrismaClient, User } from "@prisma/client";
import passport from "passport";
import kcAuth from "passport-keycloak-oauth2-oidc";
const KeyCloakStrategy = kcAuth.Strategy;
import express from "express";
import qs from "querystring";
import Debug from "debug";
import jwtUtil, { getBearerToken } from "@lib/jwt-util";
import userSvc from "@services/user-service";
import { assert } from "console";
import jwt from "jsonwebtoken";
import axios from "axios";
import { Session } from "express-session";
import { exit } from "process";
const debug = Debug("app:routes:auth");
const auth_strategy = "keycloak"; // or "oauth2" or "openidconnect"

//
// SHould probably use passport-jwt
export function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const ses = req.session as unknown as {
    jwt: string;
    passport: { user: any };
  };

  if (ses) {
    //debug(`session: ${JSON.stringify(ses)}`);
    if (ses?.passport?.user) {
      debug(`session.passport: ${JSON.stringify(ses?.passport)}`);
      if (ses?.passport?.user) {
        const user = ses.passport.user as string;
        debug(`session.passort.user: ${JSON.stringify(user)}`);
        userSvc
          .findByUsername(user)
          .then((u) => {
            const jwt = u?.jwt as string;
            const s = jwt.substring(0, 30);
            debug(`>>>>>>>> deserialized to : ${u?.id + " " + s}`);
            const decodedUser = jwtUtil.decodeSync(jwt) as User;
            debug(
              `DBG jwtAuth Decodec JWT: ${JSON.stringify(decodedUser).substring(
                0,
                50
              )}...`
            );
            req.logIn(decodedUser, (err) => {
              if (err) {
                debug(
                  `************** DBG jwtAuth Log in error : ${JSON.stringify(
                    err
                  )}`
                );
                return next(err);
              } else {
                debug(`Login good`);
                return next();
              }
            });
            debug(`DBG jwtAuth Logged in`);
          })
          .catch(next);
        return;
      } else {
        return next();
      }
    } else {
      next();
    }
  } else {
    const jwt = getBearerToken(req);

    if (jwt) {
      debug(`DBG jwtAuth JWT: ${jwt.substring(0, 30)}...`);
      const decodedUser = jwtUtil.decodeSync(jwt) as User;
      debug(`DBG jwtAuth Decodec JWT: ${JSON.stringify(decodedUser)}`);
      req.logIn(decodedUser, (err) => {
        return next(err);
      });
    }
    debug(`DBG HOST: ${req.hostname}`);
    next();
  }
}

/////////////////////////////////////////////////////////////////////
// passport.use(new JwtStrategy(
//   {
//     secretOrKey: jwtUtil.secret,
//     jwtFromRequest: ExtractJwt.fromExtractors([
//          ExtractJwt.fromAuthHeaderAsBearerToken(),
//          jwtUtil.cookieExtractor,
//          ExtractJwt.fromUrlQuerParamenter("jwt")
//     ]),
//   },
//   function(jwt_payload, done) {
//     jwtUtil.verify(jwt_payload, (ign, error, info) => {
//       userSvc.findOne({id: jwt_payload.sub}, function(err, user) {
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//             // or you could create a new account
//         }
//       }
//     }
//   }
// ))
passport.use(
  // eslint-disable-next-line max-len
  /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
  new KeyCloakStrategy(
    {
      clientID: process.env["KEYCLOAK_CLIENT_ID"],
      realm: process.env["KEYCLOAK_REALM"],
      publicClient: "false",
      clientSecret: process.env["KEYCLOAK_CLIENT_SECRET"],
      sslRequired: "external",
      authServerURL: process.env["KEYCLOAK_AUTH_ROOT"],
      callbackURL: process.env["KEYCLOAK_AUTH_CALLBACK_URL"],
      passReqToCallback: true,
    },
    function (
      req: MyRequest,
      accessToken: string,
      refreshToken: string,
      tokens: any,
      profile: any,
      // eslint-disable-next-line @typescript-eslint/ban-types
      done: Function
    ) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      // debug(`idToken: ${tokens.id_token}`);
      debug(
        `CALLBACK req? ${JSON.stringify(req.user)} ses: ${JSON.stringify(
          req.session
        )}`
      );
      const credentials = jwt.verify(
        accessToken,
        process.env["KEYCLOAK_PUBLIC_KEY"] ?? "",
        {}
      );
      debug(`accessToken Creds: ${JSON.stringify(credentials)}`);
      debug(`refreshToken: ${refreshToken}\n`);
      debug(
        `profile received from outh2: ${JSON.stringify(profile).substring(
          0,
          100
        )}`
      );
      // profile will get saved to database user row
      // XXX Note that the req.user object is a cleaned up
      // version of profile. Some fields are stripped
      profile["idToken"] = tokens.id_token;
      profile["accessToken"] = accessToken;
      profile["refreshToken"] = refreshToken;

      // These session settings seem to be lost
      req.session.idToken = tokens.id_token;
      req.session.accessToken = accessToken;
      req.session.refreshToken = refreshToken;
      //debug(`Keycloak profile=${JSON.stringify(profile)}`);
      debug(
        `CALLBACK ses after setting tokens: ${JSON.stringify(req.session)}`
      );
      const ses = req.session as unknown as Session;
      ses.save((err) => {
        if (err) {
          debug(`Error saving session: ${JSON.stringify(err)}`);
        } else {
          debug(`saved session`);
          //setTimeout(() => exit(), 1000);
        }
      });
      done(null, profile);
      // COnfirmed that done() returns to caller
    }
  )
);
passport.serializeUser(function (user, done): void {
  process.nextTick(function () {
    const u: User = user as User;
    done(null, u.username);
    // done(null, {
    //   id: u.id,
    //   username: u.username,
    //   name: u.name,
    //   idToken: u.idToken,
    //   accessToken: u.accessToken,
    //   refreshToken: u.refreshToken,
    //   jwt: u.jwt,
    // });
  });
});

passport.deserializeUser(function (user: string, done) {
  debug(`!!!!!!!!!!! deserialize : ${JSON.stringify(user)}`);
  userSvc.findByUsername(user).then((u) => {
    debug(`!!!!!!!!!!! deserialized to : ${u?.id + " " + u?.email}`);
    done(null, u);
  });
  // process.nextTick(function () {
  //   return done(null, user as User);
  // });
});

const router = express.Router();

//passport.authenticate("oauth2")); // ("openidconnect"));
router.get(
  "/login",
  passport.authenticate(auth_strategy, { scope: ["openid", "profile"] })
);

router.post(
  "/login",
  passport.authenticate(auth_strategy, { scope: ["openid", "profile"] })
);

// router.get(
//   "/oauth2/redirect",
//   passport.authenticate(auth_strategy, {
//     successRedirect: "/users",
//     failureRedirect: "/api/auth/login",
//   })
// );

router.get("/oauth2/redirect", function (req, res, next) {
  function jwtAndNext(err: any) {
    debug(`jwtAndNext. ${JSON.stringify(req.user).substring(0, 100)}`);
    const profile = req.user as {
      roles: string[];
      _json: { groups: string[] };
    };
    debug(`jwtAndNext. Roles${JSON.stringify(profile.roles)}`);
    debug(`jwtAndNext. Groups ${JSON.stringify(profile._json.groups)}`);
    if (err) {
      return next(err);
    }
    const ses = req.session as unknown as { passport: { user: any } };
    if (!req.user) {
      return next("No user data. Looks like Auth failed");
    }
    assert(req.user, "User required");

    assert(ses.passport.user, "Not logged in");

    // return res.redirect("/users");
    const jwt = jwtUtil.signSync(req.user); // .then((jwt);

    // Keycloak profile used as User object
    debug(`signed jwt: ${jwt.substring(0, 100)}`);
    //done(null, { ...user, jwt });
    const { key, options } = cookieProps;
    const s = req.session as unknown as { jwt: string };
    s.jwt = jwt;
    //res.cookie(key, jwt, options);
    const p = req.user;
    userSvc.profileToUserUpsert({ ...p, jwt }).then((user) => {
      debug(`user found`);
      return res.redirect("/users");
    });
  }
  debug(`Calling passport.authenticate`);
  passport.authenticate(auth_strategy)(req, res, jwtAndNext);
});

//   ,
//   function (req, res) {
//     // !!!!!! This is not being called
//     const jwt = (req.user as any)?.jwt;
//     debug(`post-oauth2: jwt: ${JSON.stringify(jwt)}`);
//     const { key, options } = cookieProps;
//     res.cookie(key, jwt, options);
//   }
// );
async function keycloakLogout(req: MyRequest) {
  const dbUser = await userSvc.findByUsername(req.user.username as string);
  if (!dbUser) {
    return `Couldn't find User ${req.user.username as string}`;
  }
  const url =
    `${process.env["KEYCLOAK_AUTH_ROOT"] ?? ""}/realms/` +
    `${process.env["KEYCLOAK_REALM"] ?? ""}/protocol/openid-connect/logout`;
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + dbUser.accessToken,
    },
    data: qs.stringify({
      refresh_token: dbUser.refreshToken as string,
      client_id: process.env["KEYCLOAK_CLIENT_ID"] ?? "",
      client_secret: process.env["KEYCLOAK_CLIENT_SECRET"] ?? "",
    }),
    url,
  };

  axios(options)
    .then((response) => {
      debug(`Keycloak logged out`);
      return "";
    })
    .catch((err) => {
      debug(`**** Keycloak logout failed: ${err as string}`);
      return err as string;
    });
}
router.get("/logout", function (req_, res, next) {
  const req = req_ as unknown as MyRequest;
  // debug(`token : ${JSON.stringify(req.headers)}`);
  // debug(`Axios: user ${JSON.stringify(req.user)}`);
  debug(`Axios: ses ${JSON.stringify(req.session)}`);
  debug(`Axios: aT ${req.session.accessToken as string}`);
  debug(`Axios: rT ${req.session.refreshToken as string}`);
  keycloakLogout(req as unknown as MyRequest).then((kcErr) => {
    if (kcErr) {
      // Can't do much if Keycloak logout failed.
      //  return next(kcErr);
    }
    req.logout(function (err: any) {
      if (err) {
        return next(err);
      }

      res.redirect("/");
      // const params = {
      //   client_id: process.env["KEYCLOAK_CLIENT_ID"],
      //   redirect_url: process.env["KEYCLOACK_LOGOUT_REDIRECT_URL"],
      //   // Redirect url above doesn't seem to redirect after Keycloak logout
      //   // User is stuck in a Keycloak page and must click Back a a few times to get back to App
      //   //
      //   // Below stuff doesn't seem to make any difference :-(
      //   // post_logout_redirect_uri: process.env["KEYCLOACK_LOGOUT_REDIRECT_URL"],
      //   // id_token_hint: req.user.idToken,
      //   // prompt: "none",
      // };
      // res.redirect(
      //   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      //   `${process.env["KEYCLOAK_LOGOUT_URL"]}?` + qs.stringify(params)
      // );
    });
  });
});
// OLD code
// import authService from "@services/auth-service";
// import { ParamMissingError } from "@lib/errors";
// import {  } from "express";
// import StatusCodes from "http-status-codes";

// // Constants
// const router = Router();
// const { OK } = StatusCodes;

// // Paths
// export const p = {
//   login: "/login",
//   logout: "/logout",
// } as const;

// Cookie Properties
export const cookieProps = Object.freeze({
  key: "ExpressGeneratorTs",
  secret: process.env.COOKIE_SECRET,
  options: {
    httpOnly: true,
    signed: true,
    path: process.env.COOKIE_PATH,
    maxAge: Number(process.env.COOKIE_EXP),
    domain: process.env.COOKIE_DOMAIN,
    secure: process.env.SECURE_COOKIE === "true",
  },
});

// /**
//  * Login a user.
//  */
// router.post(p.login, async (req: Request, res: Response) => {
//   // Check email and password present
//   const { email, password } = req.body;
//   if (!(email && password)) {
//     throw new ParamMissingError();
//   }
//   // Get jwt
//   const jwt = await authService.login(email, password);
//   // Add jwt to cookie
//   const { key, options } = cookieProps;
//   res.cookie(key, jwt, options);
//   // Return
//   return res.status(OK).end();
// });

// /**
//  * Logout the user.
//  */
// router.get(p.logout, (_: Request, res: Response) => {
//   const { key, options } = cookieProps;
//   res.clearCookie(key, options);
//   return res.status(OK).end();
// });

// Export router
export default router;
