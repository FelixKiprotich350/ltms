/*
  Warnings:

  - You are about to drop the column `status` on the `DraftedLetterRequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `DraftedLetterRequest` DROP FOREIGN KEY `DraftedLetterRequest_letterCategoryUuid_fkey`;

-- DropIndex
DROP INDEX `DraftedLetterRequest_letterCategoryUuid_fkey` ON `DraftedLetterRequest`;

-- AlterTable
ALTER TABLE `DraftedLetterRequest` DROP COLUMN `status`,
    MODIFY `subject` VARCHAR(191) NULL,
    MODIFY `body` VARCHAR(191) NULL,
    MODIFY `confidentiality` VARCHAR(191) NULL,
    MODIFY `senderType` VARCHAR(191) NULL,
    MODIFY `letterCategoryUuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `LetterRequest` ALTER COLUMN `status` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `DraftedLetterRequest` ADD CONSTRAINT `DraftedLetterRequest_letterCategoryUuid_fkey` FOREIGN KEY (`letterCategoryUuid`) REFERENCES `LetterCategory`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
