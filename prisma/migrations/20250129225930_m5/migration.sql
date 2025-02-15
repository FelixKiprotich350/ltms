/*
  Warnings:

  - You are about to drop the column `userUuid` on the `StockReceived` table. All the data in the column will be lost.
  - Made the column `productPackUnitUuid` on table `StockReceived` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `StockReceived` DROP FOREIGN KEY `StockReceived_productPackUnitUuid_fkey`;

-- DropIndex
DROP INDEX `StockReceived_productPackUnitUuid_fkey` ON `StockReceived`;

-- AlterTable
ALTER TABLE `StockReceived` DROP COLUMN `userUuid`,
    MODIFY `productPackUnitUuid` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `StockReceived` ADD CONSTRAINT `StockReceived_productPackUnitUuid_fkey` FOREIGN KEY (`productPackUnitUuid`) REFERENCES `ProductPackUnit`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
