/*
  Warnings:

  - A unique constraint covering the columns `[codeName]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.
  - Made the column `codeName` on table `UserRole` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `UserRole` MODIFY `codeName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserRole_codeName_key` ON `UserRole`(`codeName`);
