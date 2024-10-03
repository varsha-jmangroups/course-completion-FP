/*
  Warnings:

  - You are about to drop the column `completionStatus` on the `Enrollment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "completionStatus",
ADD COLUMN     "completionPercentage" INTEGER NOT NULL DEFAULT 0;
