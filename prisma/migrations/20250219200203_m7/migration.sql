/*
  Warnings:

  - You are about to alter the column `activeStatus` on the `OrganisationDepartment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `OrganisationDepartment` MODIFY `activeStatus` BOOLEAN NOT NULL DEFAULT false;
