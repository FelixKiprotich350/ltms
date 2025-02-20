/*
  Warnings:

  - You are about to drop the `Letter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Approval` DROP FOREIGN KEY `Approval_letterId_fkey`;

-- DropForeignKey
ALTER TABLE `Attachment` DROP FOREIGN KEY `Attachment_letterId_fkey`;

-- DropForeignKey
ALTER TABLE `Letter` DROP FOREIGN KEY `Letter_letterCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Letter` DROP FOREIGN KEY `Letter_senderDepartmentUuid_fkey`;

-- DropForeignKey
ALTER TABLE `Letter` DROP FOREIGN KEY `Letter_senderUserUuid_fkey`;

-- DropForeignKey
ALTER TABLE `LetterRecipients` DROP FOREIGN KEY `LetterRecipients_letterUuid_fkey`;

-- DropForeignKey
ALTER TABLE `LetterTicket` DROP FOREIGN KEY `LetterTicket_letterUuid_fkey`;

-- DropForeignKey
ALTER TABLE `Log` DROP FOREIGN KEY `Log_letterId_fkey`;

-- DropIndex
DROP INDEX `Approval_letterId_fkey` ON `Approval`;

-- DropIndex
DROP INDEX `Attachment_letterId_fkey` ON `Attachment`;

-- DropIndex
DROP INDEX `LetterTicket_letterUuid_fkey` ON `LetterTicket`;

-- DropIndex
DROP INDEX `Log_letterId_fkey` ON `Log`;

-- DropTable
DROP TABLE `Letter`;

-- CreateTable
CREATE TABLE `LetterRequest` (
    `uuid` VARCHAR(191) NOT NULL,
    `referenceNo` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `letterCategoryId` VARCHAR(191) NOT NULL,
    `senderUserUuid` VARCHAR(191) NOT NULL,
    `senderDepartmentUuid` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'FORWARDED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LetterRequest_referenceNo_key`(`referenceNo`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LetterRequest` ADD CONSTRAINT `LetterRequest_letterCategoryId_fkey` FOREIGN KEY (`letterCategoryId`) REFERENCES `LetterCategory`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LetterRequest` ADD CONSTRAINT `LetterRequest_senderUserUuid_fkey` FOREIGN KEY (`senderUserUuid`) REFERENCES `LtmsUser`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LetterRequest` ADD CONSTRAINT `LetterRequest_senderDepartmentUuid_fkey` FOREIGN KEY (`senderDepartmentUuid`) REFERENCES `OrganisationDepartment`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LetterRecipients` ADD CONSTRAINT `LetterRecipients_letterUuid_fkey` FOREIGN KEY (`letterUuid`) REFERENCES `LetterRequest`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LetterTicket` ADD CONSTRAINT `LetterTicket_letterUuid_fkey` FOREIGN KEY (`letterUuid`) REFERENCES `LetterRequest`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Approval` ADD CONSTRAINT `Approval_letterId_fkey` FOREIGN KEY (`letterId`) REFERENCES `LetterRequest`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_letterId_fkey` FOREIGN KEY (`letterId`) REFERENCES `LetterRequest`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_letterId_fkey` FOREIGN KEY (`letterId`) REFERENCES `LetterRequest`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
