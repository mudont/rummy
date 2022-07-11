-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'CAPTAIN', 'OWNER');

-- CreateEnum
CREATE TYPE "Suit" AS ENUM ('C', 'D', 'H', 'S', 'J');

-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('A', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K');

-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('Active', 'OwesCard', 'Dropped', 'Won', 'Lost');

-- CreateEnum
CREATE TYPE "MoveType" AS ENUM ('TakeOpen', 'TakeFromDeck', 'ReturnExtraCard', 'Meld', 'Show', 'Finish');

-- CreateEnum
CREATE TYPE "GameState" AS ENUM ('Active', 'Finished');

-- CreateTable
CREATE TABLE "identity" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roles" "Role"[],
    "emailVerified" BOOLEAN NOT NULL,
    "hashedPassword" TEXT,
    "salt" TEXT,
    "idToken" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "jwt" TEXT,

    CONSTRAINT "identity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_member" (
    "clubId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "game" (
    "id" SERIAL NOT NULL,
    "state" "GameState" NOT NULL,
    "deck" TEXT[],
    "openPile" TEXT[],
    "turnPlayerIdx" INTEGER NOT NULL,
    "openCard" TEXT,
    "currJoker" TEXT NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "life" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "playerIdx" INTEGER NOT NULL,
    "suit" TEXT NOT NULL,
    "ranks" TEXT[],

    CONSTRAINT "life_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sequence" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "playerIdx" INTEGER NOT NULL,
    "suit" TEXT NOT NULL,
    "ranks" TEXT[],
    "numJokers" INTEGER NOT NULL,

    CONSTRAINT "sequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meld" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "playerIdx" INTEGER NOT NULL,
    "lifeId" INTEGER NOT NULL,

    CONSTRAINT "meld_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_player" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "playerIdx" INTEGER NOT NULL,

    CONSTRAINT "game_player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_move" (
    "gameId" INTEGER NOT NULL,
    "moveNum" INTEGER NOT NULL,
    "playerIdx" INTEGER NOT NULL,
    "moveType" "MoveType" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "identity_username_key" ON "identity"("username");

-- CreateIndex
CREATE UNIQUE INDEX "identity_email_key" ON "identity"("email");

-- CreateIndex
CREATE UNIQUE INDEX "club_member_clubId_memberId_key" ON "club_member"("clubId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "life_gameId_playerIdx_key" ON "life"("gameId", "playerIdx");

-- CreateIndex
CREATE UNIQUE INDEX "sequence_gameId_playerIdx_key" ON "sequence"("gameId", "playerIdx");

-- CreateIndex
CREATE UNIQUE INDEX "meld_gameId_playerIdx_key" ON "meld"("gameId", "playerIdx");

-- CreateIndex
CREATE UNIQUE INDEX "game_player_gameId_playerIdx_key" ON "game_player"("gameId", "playerIdx");

-- CreateIndex
CREATE UNIQUE INDEX "game_move_gameId_moveNum_key" ON "game_move"("gameId", "moveNum");

-- AddForeignKey
ALTER TABLE "club" ADD CONSTRAINT "club_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "identity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_member" ADD CONSTRAINT "club_member_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "identity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_member" ADD CONSTRAINT "club_member_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_id_turnPlayerIdx_fkey" FOREIGN KEY ("id", "turnPlayerIdx") REFERENCES "game_player"("gameId", "playerIdx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_move" ADD CONSTRAINT "game_move_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_move" ADD CONSTRAINT "game_move_gameId_playerIdx_fkey" FOREIGN KEY ("gameId", "playerIdx") REFERENCES "game_player"("gameId", "playerIdx") ON DELETE RESTRICT ON UPDATE CASCADE;
