/*
  Warnings:

  - You are about to drop the column `status` on the `LetterRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `LetterRecipient` ADD COLUMN `status` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `LetterRequest` DROP COLUMN `status`;
