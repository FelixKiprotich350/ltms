-- CreateTable
CREATE TABLE `DraftedLetterRequest` (
    `uuid` VARCHAR(191) NOT NULL,
    `externalReference` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `confidentiality` VARCHAR(191) NOT NULL,
    `senderType` VARCHAR(191) NOT NULL,
    `letterCategoryUuid` VARCHAR(191) NOT NULL,
    `senderUserUuid` VARCHAR(191) NOT NULL,
    `senderDepartmentUuid` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DraftedLetterRequestToLog` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DraftedLetterRequestToLog_AB_unique`(`A`, `B`),
    INDEX `_DraftedLetterRequestToLog_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LetterstoRecipients` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_LetterstoRecipients_AB_unique`(`A`, `B`),
    INDEX `_LetterstoRecipients_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LetterTicket` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_LetterTicket_AB_unique`(`A`, `B`),
    INDEX `_LetterTicket_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AttachmentToDraftedLetterRequest` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AttachmentToDraftedLetterRequest_AB_unique`(`A`, `B`),
    INDEX `_AttachmentToDraftedLetterRequest_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ApprovalToDraftedLetterRequest` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ApprovalToDraftedLetterRequest_AB_unique`(`A`, `B`),
    INDEX `_ApprovalToDraftedLetterRequest_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DraftedLetterRequest` ADD CONSTRAINT `DraftedLetterRequest_letterCategoryUuid_fkey` FOREIGN KEY (`letterCategoryUuid`) REFERENCES `LetterCategory`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DraftedLetterRequest` ADD CONSTRAINT `DraftedLetterRequest_senderUserUuid_fkey` FOREIGN KEY (`senderUserUuid`) REFERENCES `LtmsUser`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DraftedLetterRequest` ADD CONSTRAINT `DraftedLetterRequest_senderDepartmentUuid_fkey` FOREIGN KEY (`senderDepartmentUuid`) REFERENCES `OrganisationDepartment`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DraftedLetterRequestToLog` ADD CONSTRAINT `_DraftedLetterRequestToLog_A_fkey` FOREIGN KEY (`A`) REFERENCES `DraftedLetterRequest`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DraftedLetterRequestToLog` ADD CONSTRAINT `_DraftedLetterRequestToLog_B_fkey` FOREIGN KEY (`B`) REFERENCES `Log`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LetterstoRecipients` ADD CONSTRAINT `_LetterstoRecipients_A_fkey` FOREIGN KEY (`A`) REFERENCES `DraftedLetterRequest`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LetterstoRecipients` ADD CONSTRAINT `_LetterstoRecipients_B_fkey` FOREIGN KEY (`B`) REFERENCES `LetterRecipients`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LetterTicket` ADD CONSTRAINT `_LetterTicket_A_fkey` FOREIGN KEY (`A`) REFERENCES `DraftedLetterRequest`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LetterTicket` ADD CONSTRAINT `_LetterTicket_B_fkey` FOREIGN KEY (`B`) REFERENCES `LetterTicket`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToDraftedLetterRequest` ADD CONSTRAINT `_AttachmentToDraftedLetterRequest_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToDraftedLetterRequest` ADD CONSTRAINT `_AttachmentToDraftedLetterRequest_B_fkey` FOREIGN KEY (`B`) REFERENCES `DraftedLetterRequest`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ApprovalToDraftedLetterRequest` ADD CONSTRAINT `_ApprovalToDraftedLetterRequest_A_fkey` FOREIGN KEY (`A`) REFERENCES `Approval`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ApprovalToDraftedLetterRequest` ADD CONSTRAINT `_ApprovalToDraftedLetterRequest_B_fkey` FOREIGN KEY (`B`) REFERENCES `DraftedLetterRequest`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
