/*
  Warnings:

  - You are about to drop the `_LetterTicket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_LetterTicket` DROP FOREIGN KEY `_LetterTicket_A_fkey`;

-- DropForeignKey
ALTER TABLE `_LetterTicket` DROP FOREIGN KEY `_LetterTicket_B_fkey`;

-- AlterTable
ALTER TABLE `LetterRequest` ADD COLUMN `rootLetterUuid` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_LetterTicket`;

-- AddForeignKey
ALTER TABLE `LetterRequest` ADD CONSTRAINT `LetterRequest_rootLetterUuid_fkey` FOREIGN KEY (`rootLetterUuid`) REFERENCES `LetterRequest`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
