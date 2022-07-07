// import userRepo from '@repos/user-repo';
// import { IUser } from '@models/user-model';
import prisma from "./prisma";
import { Prisma, Role, User } from "@prisma/client";
import { UserNotFoundError } from "@lib/errors";
import Debug from "debug";
const debug = Debug("app:svc:user");
async function profileToUserUpsert(profile: Record<string, any>) {
  const tmpObj: { [key: string]: any } = profileToUser(profile);
  const obj = await prisma.user.upsert({
    where: { username: tmpObj?.username },
    create: tmpObj as Prisma.UserCreateInput,
    update: tmpObj as Prisma.UserUpdateInput,
  });
  debug(`upserted ************: ${JSON.stringify(obj).substring(0, 100)}`);
  return tmpObj;
}
function profileToUser(profile: Record<string, any>) {
  const tmpObj: { [key: string]: any } = {};
  "username name username email idToken accessToken refreshToken jwt"
    .split(" ")
    .map((s: string) => {
      if (s in profile) {
        tmpObj[s] = profile[s];
      }
    });
  tmpObj["emailVerified"] =
    profile["email_verified"] || profile["emailVerified"];
  const dBRoles = "ADMIN CAPTAIN USER".split(" ");
  let _ur = (profile?._json?.groups || []) as string[];
  _ur = _ur.concat(profile.roles as string[]).map((s) => s.toUpperCase());
  const userRoles = dBRoles.filter((s) => _ur.includes(s));
  tmpObj["roles"] = userRoles;
  return tmpObj;
}

/**
 * Get all users.
 *
 * @returns
 */
function getAll(): Promise<any[]> {
  return prisma.user.findMany();
}

/**
 * Add one user.
 *
 * @param user
 * @returns
 */
async function addOne(user: Prisma.UserCreateInput): Promise<User> {
  const u = prisma.user.create({ data: user });
  return u;
}

/**
 * Update one user.
 *
 * @param user
 * @returns
 */
async function updateOne(user: User): Promise<void> {
  const persists = await prisma.user.findUnique({ where: { id: user.id } });
  if (!persists) {
    throw new UserNotFoundError();
  }
  await prisma.user.update({
    where: { id: user.id },
    data: user,
  });
}
async function findByUsername(username: string): Promise<User | null> {
  const dbUser = await prisma.user.findUnique({ where: { username } });
  return dbUser;
}

async function findOrCreate(user: Prisma.UserCreateInput): Promise<User> {
  let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser) {
    dbUser = await addOne(user);
  }
  return dbUser;
}

/**
 * Delete a user by their id.
 *
 * @param id
 * @returns
 */
async function deleteOne(id: number): Promise<void> {
  const user: User | null = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new UserNotFoundError();
  }
  await prisma.user.delete({ where: { id } });
}

// Export default
export default {
  getAll,
  addOne,
  updateOne,
  delete: deleteOne,
  findByUsername,
  findOrCreate,
  profileToUser,
  profileToUserUpsert,
} as const;
