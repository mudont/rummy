import bcrypt from "bcrypt";

import userRepo from "@repos/user-repo";
import jwtUtil from "@lib/jwt-util";
import { UnauthorizedError } from "@lib/errors";

/**
 * Login()
 *
 * @param email
 * @param password
 * @returns
 */
async function login(email: string, password: string): Promise<string> {
  // Fetch user
  const user = await userRepo.getOne(email);
  if (!user) {
    throw new UnauthorizedError();
  }
  // Check password
  const pwdPassed = await bcrypt.compare(password, user.hashedPassword);
  if (!pwdPassed) {
    throw new UnauthorizedError();
  }
  // Setup Admin Cookie
  return jwtUtil.sign({
    id: user.id,
    email: user.name,
    name: user.name,
    role: user.role,
  });
}

// Export default
export default {
  login,
} as const;
