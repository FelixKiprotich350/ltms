/*
  Warnings:

  - You are about to drop the `LetterRecipients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `LetterRecipients` DROP FOREIGN KEY `LetterRecipients_letterUuid_fkey`;

-- DropForeignKey
ALTER TABLE `LetterRecipients` DROP FOREIGN KEY `LetterRecipients_recipientUuid_fkey`;

-- DropForeignKey
ALTER TABLE `_LetterstoRecipients` DROP FOREIGN KEY `_LetterstoRecipients_B_fkey`;

-- AlterTable
ALTER TABLE `LetterRequest` MODIFY `body` TEXT NOT NULL;

-- DropTable
DROP TABLE `LetterRecipients`;

-- CreateTable
CREATE TABLE `LetterRecipient` (
    `uuid` VARCHAR(191) NOT NULL,
    `letterUuid` VARCHAR(191) NOT NULL,
    `recipientUuid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LetterRecipient_letterUuid_recipientUuid_key`(`letterUuid`, `recipientUuid`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LetterRecipient` ADD CONSTRAINT `LetterRecipient_letterUuid_fkey` FOREIGN KEY (`letterUuid`) REFERENCES `LetterRequest`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LetterRecipient` ADD CONSTRAINT `LetterRecipient_recipientUuid_fkey` FOREIGN KEY (`recipientUuid`) REFERENCES `RecipientsMaster`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LetterstoRecipients` ADD CONSTRAINT `_LetterstoRecipients_B_fkey` FOREIGN KEY (`B`) REFERENCES `LetterRecipient`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
