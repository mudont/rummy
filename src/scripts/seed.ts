import prisma from "../services/prisma";
import Debug from "debug";
const debug = Debug("app:scripts:seed");
import { Role } from "@prisma/client";
// A `main` function so that we can use async/await
async function main() {
  // Seed the database with users and posts
  const users = [
    {
      email: "maverickone@gmail.com",
      username: "murali",
      name: "Murali P Donthireddy",
      roles: [Role.ADMIN, Role.USER],
      hashedPassword: "hp",
      salt: "salt",
      idToken: "",
      accessToken: "",
      refreshToken: "",
      emailVerified: true,
    },
    {
      email: "rajanireddy17@gmail.com",
      username: "rajani",
      name: "Rajani P Donthireddy",
      roles: [Role.USER],
      hashedPassword: "hp",
      salt: "salt",
      idToken: "",
      accessToken: "",
      refreshToken: "",
      emailVerified: true,
    },
    {
      email: "donthrieddy@gmail.com",
      username: "ymurali",
      name: "Murali Y Donthireddy",
      roles: [Role.USER],
      hashedPassword: "hp",
      salt: "salt",
      idToken: "",
      accessToken: "",
      refreshToken: "",
      emailVerified: true,
    },
  ];
  for (const user of users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: user,
      create: user,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async (): Promise<any> => {
    await prisma.$disconnect();
  });
