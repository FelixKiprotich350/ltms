/*
  Warnings:

  - The primary key for the `Notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `Approval` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ApprovalToDraftedLetterRequest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `notificationMasterUuid` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `Notification` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `Approval` DROP FOREIGN KEY `Approval_letterUuid_fkey`;

-- DropForeignKey
ALTER TABLE `Approval` DROP FOREIGN KEY `Approval_userUuid_fkey`;

-- DropForeignKey
ALTER TABLE `_ApprovalToDraftedLetterRequest` DROP FOREIGN KEY `_ApprovalToDraftedLetterRequest_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ApprovalToDraftedLetterRequest` DROP FOREIGN KEY `_ApprovalToDraftedLetterRequest_B_fkey`;

-- AlterTable
ALTER TABLE `Notification` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `type`,
    ADD COLUMN `notificationMasterUuid` VARCHAR(191) NOT NULL,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`uuid`);

-- AlterTable
ALTER TABLE `PermissionMaster` ALTER COLUMN `category` DROP DEFAULT;

-- DropTable
DROP TABLE `Approval`;

-- DropTable
DROP TABLE `_ApprovalToDraftedLetterRequest`;

-- CreateTable
CREATE TABLE `NotificationMaster` (
    `uuid` VARCHAR(191) NOT NULL,
    `codeName` VARCHAR(191) NOT NULL,
    `commonName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isEnabled` BOOLEAN NOT NULL DEFAULT true,
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NotificationMaster_codeName_key`(`codeName`),
    UNIQUE INDEX `NotificationMaster_commonName_key`(`commonName`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_notificationMasterUuid_fkey` FOREIGN KEY (`notificationMasterUuid`) REFERENCES `NotificationMaster`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
