/*
  Warnings:

  - A unique constraint covering the columns `[userPersonUuid]` on the table `RecipientsMaster` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `RecipientsMaster` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `RecipientsMaster_userPersonUuid_key` ON `RecipientsMaster`(`userPersonUuid`);
