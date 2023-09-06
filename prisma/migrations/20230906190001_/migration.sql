/*
  Warnings:

  - You are about to drop the column `city` on the `location` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `location` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `location` table. All the data in the column will be lost.
  - Added the required column `address` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `location` DROP COLUMN `city`,
    DROP COLUMN `province`,
    DROP COLUMN `street`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL;
