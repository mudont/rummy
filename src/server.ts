import Debug from "debug";
const debug = Debug("app:server");
debug("In server.ts");

import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import StatusCodes from "http-status-codes";
// import { Server as SocketIo } from "socket.io";
import socketio from "socket.io";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import ConnectSQLite from "connect-sqlite3";
const SQLiteStore = ConnectSQLite(session);

import "express-async-errors";

import BaseRouter from "./routes/api";
import logger from "jet-logger";
import { cookieProps, jwtAuth } from "@routes/auth-router";
import { CustomError } from "@lib/errors";
import cors from "cors";
import dotenv from "dotenv";

import graphqlServer from "./graphql-server";
import http from "http";
import jwtUtil from "@lib/jwt-util";
import { User } from "./types";
dotenv.config();

const app = express();
app.use(cors());
app.set("trust proxy", ["loopback"]);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "." }),
  })
);
// below is equivalent to app.use(passport.session());
app.use(passport.authenticate("session"));
/////// START OF TOY CODE //////////////
// Just for understanding
/////// END OF TOY CODE /////////////////

app.use(jwtAuth);

//app.use(passport.authenticate("jwt"));
/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookieProps.secret));

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

// Add APIs
app.use("/api", BaseRouter);

// Error handling
app.use(
  (err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    const status =
      err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST;
    return res.status(status).json({
      error: err.message,
    });
  }
);

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Login page
app.get("/", (req: Request, res: Response) => {
  return res.sendFile("login.html", { root: viewsDir });
});

// Users page
app.get("/users", (req: Request, res: Response) => {
  // const jwt = req.signedCookies[cookieProps.key];
  if (!req.user) {
    // if (!jwt) {
    return res.redirect("/");
  } else {
    debug(`/USERS ses after setting tokens: ${JSON.stringify(req.session)}`);
    return res.sendFile("users.html", { root: viewsDir });
  }
});

// Chat page
app.get("/chat", (req: Request, res: Response) => {
  //const jwt = req.signedCookies[cookieProps.key];
  if (!req.user) {
    return res.redirect("/");
  } else {
    return res.sendFile("chat.html", { root: viewsDir });
  }
});

//server.start().then(() => {
const server = graphqlServer(app);

debug("All setup");
export default server;
