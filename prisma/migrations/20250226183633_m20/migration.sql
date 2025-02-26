/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PermissionToUserRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_PermissionToUserRole` DROP FOREIGN KEY `_PermissionToUserRole_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PermissionToUserRole` DROP FOREIGN KEY `_PermissionToUserRole_B_fkey`;

-- DropTable
DROP TABLE `Permission`;

-- DropTable
DROP TABLE `_PermissionToUserRole`;

-- CreateTable
CREATE TABLE `PermissionMaster` (
    `uuid` VARCHAR(191) NOT NULL,
    `codeName` VARCHAR(191) NOT NULL,
    `commonName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PermissionMaster_codeName_key`(`codeName`),
    UNIQUE INDEX `PermissionMaster_commonName_key`(`commonName`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPermission` (
    `uuid` VARCHAR(191) NOT NULL,
    `userUuid` VARCHAR(191) NOT NULL,
    `permissionUuid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DefaultRolePermission` (
    `uuid` VARCHAR(191) NOT NULL,
    `userRoleUuid` VARCHAR(191) NOT NULL,
    `permissionUuid` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_permissionUuid_fkey` FOREIGN KEY (`permissionUuid`) REFERENCES `PermissionMaster`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_userUuid_fkey` FOREIGN KEY (`userUuid`) REFERENCES `LtmsUser`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DefaultRolePermission` ADD CONSTRAINT `DefaultRolePermission_userRoleUuid_fkey` FOREIGN KEY (`userRoleUuid`) REFERENCES `UserRole`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
