-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_ownerId_fkey`;

-- AlterTable
ALTER TABLE `Project` MODIFY `ownerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
