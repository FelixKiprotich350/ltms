-- AlterTable
ALTER TABLE `LetterRequest` ADD COLUMN `parentLetterUuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `LetterTicket` ADD COLUMN `ticketClosed` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `LetterRequest` ADD CONSTRAINT `LetterRequest_parentLetterUuid_fkey` FOREIGN KEY (`parentLetterUuid`) REFERENCES `LetterRequest`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
