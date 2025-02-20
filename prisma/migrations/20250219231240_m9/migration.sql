/*
  Warnings:

  - You are about to drop the column `letterId` on the `Approval` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Approval` table. All the data in the column will be lost.
  - You are about to drop the column `letterId` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `letterCategoryId` on the `LetterRequest` table. All the data in the column will be lost.
  - You are about to drop the column `referenceNo` on the `LetterRequest` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `LetterRequest` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `VarChar(191)`.
  - You are about to drop the column `letterId` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `UserGroupMember` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserGroupMember` table. All the data in the column will be lost.
  - Added the required column `letterUuid` to the `Approval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUuid` to the `Approval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `letterUuid` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confidentiality` to the `LetterRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `letterCategoryUuid` to the `LetterRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `letterUuid` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUuid` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUuid` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupUuid` to the `UserGroupMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUuid` to the `UserGroupMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Approval` DROP FOREIGN KEY `Approval_letterId_fkey`;

-- DropForeignKey
ALTER TABLE `Approval` DROP FOREIGN KEY `Approval_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Attachment` DROP FOREIGN KEY `Attachment_letterId_fkey`;

-- DropForeignKey
ALTER TABLE `LetterRequest` DROP FOREIGN KEY `LetterRequest_letterCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Log` DROP FOREIGN KEY `Log_letterId_fkey`;

-- DropForeignKey
ALTER TABLE `Log` DROP FOREIGN KEY `Log_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserGroupMember` DROP FOREIGN KEY `UserGroupMember_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `UserGroupMember` DROP FOREIGN KEY `UserGroupMember_userId_fkey`;

-- DropIndex
DROP INDEX `Approval_letterId_fkey` ON `Approval`;

-- DropIndex
DROP INDEX `Approval_userId_fkey` ON `Approval`;

-- DropIndex
DROP INDEX `Attachment_letterId_fkey` ON `Attachment`;

-- DropIndex
DROP INDEX `LetterRequest_letterCategoryId_fkey` ON `LetterRequest`;

-- DropIndex
DROP INDEX `LetterRequest_referenceNo_key` ON `LetterRequest`;

-- DropIndex
DROP INDEX `Log_letterId_fkey` ON `Log`;

-- DropIndex
DROP INDEX `Log_userId_fkey` ON `Log`;

-- DropIndex
DROP INDEX `Notification_userId_fkey` ON `Notification`;

-- DropIndex
DROP INDEX `UserGroupMember_groupId_fkey` ON `UserGroupMember`;

-- DropIndex
DROP INDEX `UserGroupMember_userId_fkey` ON `UserGroupMember`;

-- AlterTable
ALTER TABLE `Approval` DROP COLUMN `letterId`,
    DROP COLUMN `userId`,
    ADD COLUMN `letterUuid` VARCHAR(191) NOT NULL,
    ADD COLUMN `userUuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Attachment` DROP COLUMN `letterId`,
    ADD COLUMN `letterUuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `LetterRequest` DROP COLUMN `letterCategoryId`,
    DROP COLUMN `referenceNo`,
    ADD COLUMN `confidentiality` VARCHAR(191) NOT NULL,
    ADD COLUMN `externalReference` VARCHAR(191) NULL,
    ADD COLUMN `letterCategoryUuid` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `Log` DROP COLUMN `letterId`,
    DROP COLUMN `userId`,
    ADD COLUMN `letterUuid` VARCHAR(191) NOT NULL,
    ADD COLUMN `userUuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `userId`,
    ADD COLUMN `userUuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `UserGroupMember` DROP COLUMN `groupId`,
    DROP COLUMN `userId`,
    ADD COLUMN `groupUuid` VARCHAR(191) NOT NULL,
    ADD COLUMN `userUuid` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `LetterRequest` ADD CONSTRAINT `LetterRequest_letterCategoryUuid_fkey` FOREIGN KEY (`letterCategoryUuid`) REFERENCES `LetterCategory`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_letterUuid_fkey` FOREIGN KEY (`letterUuid`) REFERENCES `LetterRequest`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroupMember` ADD CONSTRAINT `UserGroupMember_userUuid_fkey` FOREIGN KEY (`userUuid`) REFERENCES `LtmsUser`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroupMember` ADD CONSTRAINT `UserGroupMember_groupUuid_fkey` FOREIGN KEY (`groupUuid`) REFERENCES `UserGroup`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Approval` ADD CONSTRAINT `Approval_letterUuid_fkey` FOREIGN KEY (`letterUuid`) REFERENCES `LetterRequest`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Approval` ADD CONSTRAINT `Approval_userUuid_fkey` FOREIGN KEY (`userUuid`) REFERENCES `LtmsUser`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userUuid_fkey` FOREIGN KEY (`userUuid`) REFERENCES `LtmsUser`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_letterUuid_fkey` FOREIGN KEY (`letterUuid`) REFERENCES `LetterRequest`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_userUuid_fkey` FOREIGN KEY (`userUuid`) REFERENCES `LtmsUser`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
