/*
  Warnings:

  - You are about to drop the column `userId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Stroke` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Stroke" DROP CONSTRAINT "Stroke_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."Stroke" DROP COLUMN "userId";
