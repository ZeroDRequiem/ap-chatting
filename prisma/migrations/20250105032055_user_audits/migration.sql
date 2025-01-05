/*
  Warnings:

  - You are about to drop the `_ChatRoomToUser` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `ChatRoomUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `createdById` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_ChatRoomToUser_B_index";

-- DropIndex
DROP INDEX "_ChatRoomToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ChatRoomToUser";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL
);
INSERT INTO "new_ChatRoom" ("id", "name") SELECT "id", "name" FROM "ChatRoom";
DROP TABLE "ChatRoom";
ALTER TABLE "new_ChatRoom" RENAME TO "ChatRoom";
CREATE TABLE "new_ChatRoomUser" (
    "chatRoomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("chatRoomId", "userId")
);
INSERT INTO "new_ChatRoomUser" ("chatRoomId", "userId") SELECT "chatRoomId", "userId" FROM "ChatRoomUser";
DROP TABLE "ChatRoomUser";
ALTER TABLE "new_ChatRoomUser" RENAME TO "ChatRoomUser";
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chatRoomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Message" ("chatRoomId", "createdAt", "id", "userId", "value") SELECT "chatRoomId", "createdAt", "id", "userId", "value" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
