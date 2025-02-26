/*
  Warnings:

  - Made the column `status` on table `LetterRecipient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `LetterRecipient` MODIFY `status` VARCHAR(191) NOT NULL;
