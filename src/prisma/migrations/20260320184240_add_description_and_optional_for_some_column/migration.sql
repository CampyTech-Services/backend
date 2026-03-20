/*
  Warnings:

  - Added the required column `name` to the `comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin" ALTER COLUMN "shortBio" DROP NOT NULL,
ALTER COLUMN "profilePicture" DROP NOT NULL;

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
