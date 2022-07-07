import { NextFunction } from "express";

export interface User {
  id?: string;
  username?: string;
  displayName?: string;
  roles: string[];
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
}

export type MyRequest = Request & {
  user: User;
  render: Function;
  params: { id: string };
  body: { title: string; filter: string; completed: boolean };
  logout: Function;
  session: Record<string, unknown>;
};
export type MyResponse = Response & {
  locals: any;
  render: Function;
  redirect: Function;
};
export type Handler = (
  req: MyRequest,
  res: MyResponse,
  next: NextFunction
) => void;
