/*
  Warnings:

  - You are about to drop the column `turnPlayerIdx` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `life` table. All the data in the column will be lost.
  - You are about to drop the column `playerIdx` on the `life` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `meld` table. All the data in the column will be lost.
  - You are about to drop the column `lifeId` on the `meld` table. All the data in the column will be lost.
  - You are about to drop the column `playerIdx` on the `meld` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `sequence` table. All the data in the column will be lost.
  - You are about to drop the column `playerIdx` on the `sequence` table. All the data in the column will be lost.
  - You are about to drop the column `ranks` on the `sequence` table. All the data in the column will be lost.
  - You are about to drop the column `suit` on the `sequence` table. All the data in the column will be lost.
  - You are about to drop the `game_move` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[gamePlayerId]` on the table `meld` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `turnPlayerId` to the `game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `game_player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meldId` to the `life` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gamePlayerId` to the `meld` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meldId` to the `sequence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank` to the `sequence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "game" DROP CONSTRAINT "game_id_turnPlayerIdx_fkey";

-- DropForeignKey
ALTER TABLE "game_move" DROP CONSTRAINT "game_move_gameId_fkey";

-- DropForeignKey
ALTER TABLE "game_move" DROP CONSTRAINT "game_move_gameId_playerIdx_fkey";

-- DropIndex
DROP INDEX "life_gameId_playerIdx_key";

-- DropIndex
DROP INDEX "meld_gameId_playerIdx_key";

-- DropIndex
DROP INDEX "sequence_gameId_playerIdx_key";

-- AlterTable
ALTER TABLE "game" DROP COLUMN "turnPlayerIdx",
ADD COLUMN     "turnPlayerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "game_player" ADD COLUMN     "hand" TEXT[],
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "life" DROP COLUMN "gameId",
DROP COLUMN "playerIdx",
ADD COLUMN     "meldId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "meld" DROP COLUMN "gameId",
DROP COLUMN "lifeId",
DROP COLUMN "playerIdx",
ADD COLUMN     "gamePlayerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "sequence" DROP COLUMN "gameId",
DROP COLUMN "playerIdx",
DROP COLUMN "ranks",
DROP COLUMN "suit",
ADD COLUMN     "meldId" INTEGER NOT NULL,
ADD COLUMN     "rank" TEXT NOT NULL,
ADD COLUMN     "suits" TEXT[];

-- DropTable
DROP TABLE "game_move";

-- CreateTable
CREATE TABLE "triplet" (
    "id" SERIAL NOT NULL,
    "meldId" INTEGER NOT NULL,
    "suit" TEXT NOT NULL,
    "ranks" TEXT[],
    "numJokers" INTEGER NOT NULL,

    CONSTRAINT "triplet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simple_move" (
    "id" SERIAL NOT NULL,
    "moveNum" INTEGER NOT NULL,
    "gamePlayerId" INTEGER NOT NULL,
    "moveType" "MoveType" NOT NULL,

    CONSTRAINT "simple_move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "show_move" (
    "id" SERIAL NOT NULL,
    "moveNum" INTEGER NOT NULL,
    "gamePlayerId" INTEGER NOT NULL,
    "moveType" "MoveType" NOT NULL,
    "meldId" INTEGER NOT NULL,

    CONSTRAINT "show_move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_card_move" (
    "id" SERIAL NOT NULL,
    "moveNum" INTEGER NOT NULL,
    "gamePlayerId" INTEGER NOT NULL,
    "moveType" "MoveType" NOT NULL,
    "card" TEXT NOT NULL,

    CONSTRAINT "return_card_move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meld_move" (
    "id" SERIAL NOT NULL,
    "moveNum" INTEGER NOT NULL,
    "gamePlayerId" INTEGER NOT NULL,
    "moveType" "MoveType" NOT NULL,
    "meldId" INTEGER NOT NULL,

    CONSTRAINT "meld_move_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "meld_gamePlayerId_key" ON "meld"("gamePlayerId");

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_turnPlayerId_fkey" FOREIGN KEY ("turnPlayerId") REFERENCES "game_player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_player" ADD CONSTRAINT "game_player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "identity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_player" ADD CONSTRAINT "game_player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meld" ADD CONSTRAINT "meld_gamePlayerId_fkey" FOREIGN KEY ("gamePlayerId") REFERENCES "game_player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "life" ADD CONSTRAINT "life_meldId_fkey" FOREIGN KEY ("meldId") REFERENCES "meld"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sequence" ADD CONSTRAINT "sequence_meldId_fkey" FOREIGN KEY ("meldId") REFERENCES "meld"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triplet" ADD CONSTRAINT "triplet_meldId_fkey" FOREIGN KEY ("meldId") REFERENCES "meld"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simple_move" ADD CONSTRAINT "simple_move_gamePlayerId_fkey" FOREIGN KEY ("gamePlayerId") REFERENCES "game_player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show_move" ADD CONSTRAINT "show_move_gamePlayerId_fkey" FOREIGN KEY ("gamePlayerId") REFERENCES "game_player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show_move" ADD CONSTRAINT "show_move_meldId_fkey" FOREIGN KEY ("meldId") REFERENCES "meld"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_card_move" ADD CONSTRAINT "return_card_move_gamePlayerId_fkey" FOREIGN KEY ("gamePlayerId") REFERENCES "game_player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meld_move" ADD CONSTRAINT "meld_move_gamePlayerId_fkey" FOREIGN KEY ("gamePlayerId") REFERENCES "game_player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meld_move" ADD CONSTRAINT "meld_move_meldId_fkey" FOREIGN KEY ("meldId") REFERENCES "meld"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
