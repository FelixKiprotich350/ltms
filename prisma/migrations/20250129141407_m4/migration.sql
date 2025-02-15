-- AlterTable
ALTER TABLE `TrtUser` MODIFY `loginStatus` VARCHAR(191) NOT NULL DEFAULT 'ENABLED';

-- CreateTable
CREATE TABLE `StockReceived` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `productUuid` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(65, 30) NOT NULL,
    `receivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userUuid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `productPackUnitUuid` VARCHAR(191) NULL,

    UNIQUE INDEX `StockReceived_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StockReceived` ADD CONSTRAINT `StockReceived_productUuid_fkey` FOREIGN KEY (`productUuid`) REFERENCES `Product`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockReceived` ADD CONSTRAINT `StockReceived_productPackUnitUuid_fkey` FOREIGN KEY (`productPackUnitUuid`) REFERENCES `ProductPackUnit`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
