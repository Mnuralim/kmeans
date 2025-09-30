/*
  Warnings:

  - You are about to drop the column `tahun_akademik` on the `spp` table. All the data in the column will be lost.
  - Added the required column `id_tahun_akademik` to the `spp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `spp` DROP COLUMN `tahun_akademik`,
    ADD COLUMN `id_tahun_akademik` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `spp` ADD CONSTRAINT `spp_id_tahun_akademik_fkey` FOREIGN KEY (`id_tahun_akademik`) REFERENCES `tahun_akademik`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
