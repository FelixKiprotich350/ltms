/*
  Warnings:

  - You are about to drop the column `letterUuid` on the `RecipientsMaster` table. All the data in the column will be lost.
  - Added the required column `recipientType` to the `RecipientsMaster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RecipientsMaster` DROP COLUMN `letterUuid`,
    ADD COLUMN `recipientType` VARCHAR(191) NOT NULL;
