/*
  Warnings:

  - Added the required column `userCreatingTicketUuuid` to the `LetterTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LetterTicket` ADD COLUMN `userCreatingTicketUuuid` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `LetterTicket` ADD CONSTRAINT `LetterTicket_userCreatingTicketUuuid_fkey` FOREIGN KEY (`userCreatingTicketUuuid`) REFERENCES `LtmsUser`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
