/*
  Warnings:

  - A unique constraint covering the columns `[letterUuid]` on the table `LetterTicket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `LetterTicket_letterUuid_key` ON `LetterTicket`(`letterUuid`);
