/*
  Warnings:

  - You are about to drop the column `states` on the `location` table. All the data in the column will be lost.
  - Added the required column `province` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `location` DROP COLUMN `states`,
    ADD COLUMN `province` VARCHAR(191) NOT NULL;
