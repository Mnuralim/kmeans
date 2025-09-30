/*
  Warnings:

  - You are about to drop the column `tahun_akademik` on the `siswa` table. All the data in the column will be lost.
  - Added the required column `id_tahun_akademik` to the `siswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `siswa` DROP COLUMN `tahun_akademik`,
    ADD COLUMN `id_tahun_akademik` VARCHAR(191) NOT NULL,
    ADD COLUMN `kelas_berikutnya` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `tahun_akademik` (
    `id` VARCHAR(191) NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `tanggal_mulai` DATETIME(3) NOT NULL,
    `tanggal_selesai` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `isCurrent` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tahun_akademik_id_key`(`id`),
    UNIQUE INDEX `tahun_akademik_year_key`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `riwayat_upgrade_kelas` (
    `id` VARCHAR(191) NOT NULL,
    `id_siswa` VARCHAR(191) NOT NULL,
    `kelas_sebelumnya` VARCHAR(191) NOT NULL,
    `kelas_baru` VARCHAR(191) NOT NULL,
    `tahun_akademik_sebelumnya` VARCHAR(191) NOT NULL,
    `tahun_akademik_baru` VARCHAR(191) NOT NULL,
    `dilakukan_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dilakukan_oleh` VARCHAR(191) NULL,

    UNIQUE INDEX `riwayat_upgrade_kelas_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `siswa` ADD CONSTRAINT `siswa_id_tahun_akademik_fkey` FOREIGN KEY (`id_tahun_akademik`) REFERENCES `tahun_akademik`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat_upgrade_kelas` ADD CONSTRAINT `riwayat_upgrade_kelas_id_siswa_fkey` FOREIGN KEY (`id_siswa`) REFERENCES `siswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
