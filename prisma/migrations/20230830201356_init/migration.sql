/*
  Warnings:

  - You are about to drop the column `checked` on the `checklist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `checklist` DROP COLUMN `checked`,
    ADD COLUMN `isChecked` BOOLEAN NOT NULL DEFAULT false;
