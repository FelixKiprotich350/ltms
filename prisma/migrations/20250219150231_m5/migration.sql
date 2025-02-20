/*
  Warnings:

  - You are about to drop the column `recipientUuid` on the `RecipientsMaster` table. All the data in the column will be lost.
  - Added the required column `departmentUuid` to the `RecipientsMaster` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `RecipientsMaster` DROP FOREIGN KEY `RecipientsMaster_recipientUuid_fkey`;

-- DropIndex
DROP INDEX `RecipientsMaster_recipientUuid_fkey` ON `RecipientsMaster`;

-- AlterTable
ALTER TABLE `RecipientsMaster` DROP COLUMN `recipientUuid`,
    ADD COLUMN `departmentUuid` VARCHAR(191) NOT NULL,
    ADD COLUMN `userPersonUuid` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `RecipientsMaster` ADD CONSTRAINT `RecipientsMaster_departmentUuid_fkey` FOREIGN KEY (`departmentUuid`) REFERENCES `OrganisationDepartment`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecipientsMaster` ADD CONSTRAINT `RecipientsMaster_userPersonUuid_fkey` FOREIGN KEY (`userPersonUuid`) REFERENCES `LtmsUser`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
