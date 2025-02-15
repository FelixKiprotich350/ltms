/*
  Warnings:

  - You are about to drop the column `productPackUnitUuid` on the `StockReceived` table. All the data in the column will be lost.
  - Added the required column `PackUnitUuid` to the `StockReceived` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `StockReceived` DROP FOREIGN KEY `StockReceived_productPackUnitUuid_fkey`;

-- DropIndex
DROP INDEX `StockReceived_productPackUnitUuid_fkey` ON `StockReceived`;

-- AlterTable
ALTER TABLE `StockReceived` DROP COLUMN `productPackUnitUuid`,
    ADD COLUMN `PackUnitUuid` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `StockReceived` ADD CONSTRAINT `StockReceived_PackUnitUuid_fkey` FOREIGN KEY (`PackUnitUuid`) REFERENCES `PackagingUnit`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
