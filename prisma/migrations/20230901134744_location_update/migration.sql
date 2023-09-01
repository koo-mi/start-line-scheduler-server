/*
  Warnings:

  - You are about to drop the column `address` on the `location` table. All the data in the column will be lost.
  - Added the required column `city` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `states` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `location` DROP COLUMN `address`,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `states` VARCHAR(191) NOT NULL,
    ADD COLUMN `street` VARCHAR(191) NOT NULL;
