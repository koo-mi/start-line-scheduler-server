-- DropForeignKey
ALTER TABLE `checklist` DROP FOREIGN KEY `Checklist_user_ProfileId_fkey`;

-- DropForeignKey
ALTER TABLE `location` DROP FOREIGN KEY `Location_user_ProfileId_fkey`;

-- DropForeignKey
ALTER TABLE `navigation` DROP FOREIGN KEY `Navigation_directionId_fkey`;

-- DropForeignKey
ALTER TABLE `user_profile` DROP FOREIGN KEY `User_Profile_userId_fkey`;

-- AddForeignKey
ALTER TABLE `User_Profile` ADD CONSTRAINT `User_Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_user_ProfileId_fkey` FOREIGN KEY (`user_ProfileId`) REFERENCES `User_Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Checklist` ADD CONSTRAINT `Checklist_user_ProfileId_fkey` FOREIGN KEY (`user_ProfileId`) REFERENCES `User_Profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Navigation` ADD CONSTRAINT `Navigation_directionId_fkey` FOREIGN KEY (`directionId`) REFERENCES `Direction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
