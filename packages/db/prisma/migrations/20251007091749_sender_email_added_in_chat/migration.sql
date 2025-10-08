/*
  Warnings:

  - You are about to drop the column `userName` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Stroke` table. All the data in the column will be lost.
  - Added the required column `senderEmail` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "userName",
ADD COLUMN     "senderEmail" TEXT NOT NULL,
ADD COLUMN     "senderName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Stroke" DROP COLUMN "userName";
