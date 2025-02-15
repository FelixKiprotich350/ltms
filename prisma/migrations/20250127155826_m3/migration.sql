/*
  Warnings:

  - You are about to drop the column `status` on the `TrtUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `TrtUser` DROP COLUMN `status`,
    ADD COLUMN `approvalStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `loginStatus` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE';
