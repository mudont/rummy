import StatusCodes from "http-status-codes";
import { Request, Response, NextFunction } from "express";

import { cookieProps } from "@routes/auth-router";
import jwtUtil from "@lib/jwt-util";
import Debug from "debug";
const debug = Debug("app:routes:middleware");
// Constants
const { UNAUTHORIZED } = StatusCodes;
const jwtNotPresentErr = "JWT not present in signed cookie.";

/**
 * Middleware to verify if user is an admin.
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export function authMw(req: Request, res: Response, next: NextFunction) {
  try {
    debug(`in authMw`);
    // Get json-web-token
    // const jwt = req.signedCookies[cookieProps.key];
    if (!req.user) {
      debug(`No User`);
      throw Error(jwtNotPresentErr);
    }
    // Make sure user role is an admin
    // const clientData = await jwtUtil.decode(jwt);
    const clientData = req.user;
    if (!!clientData) {
      res.locals.sessionUser = clientData;
      next();
    } else {
      throw Error(jwtNotPresentErr);
    }
  } catch (err) {
    debug(`Caught an error : ${JSON.stringify(err)}`);
    return res.status(UNAUTHORIZED).json({
      error: err.message,
    });
  }
}
