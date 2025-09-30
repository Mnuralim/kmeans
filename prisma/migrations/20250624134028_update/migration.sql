/*
  Warnings:

  - You are about to drop the `cluster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clustering` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hasil_clustering` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `clustering` DROP FOREIGN KEY `clustering_id_cluster_fkey`;

-- DropForeignKey
ALTER TABLE `clustering` DROP FOREIGN KEY `clustering_id_siswa_fkey`;

-- DropForeignKey
ALTER TABLE `hasil_clustering` DROP FOREIGN KEY `hasil_clustering_id_cluster_fkey`;

-- DropForeignKey
ALTER TABLE `hasil_clustering` DROP FOREIGN KEY `hasil_clustering_id_clustering_fkey`;

-- DropForeignKey
ALTER TABLE `hasil_clustering` DROP FOREIGN KEY `hasil_clustering_id_siswa_fkey`;

-- DropTable
DROP TABLE `cluster`;

-- DropTable
DROP TABLE `clustering`;

-- DropTable
DROP TABLE `hasil_clustering`;

-- CreateTable
CREATE TABLE `sesi_clustering` (
    `id` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `nama_file` VARCHAR(191) NOT NULL,
    `total_data` INTEGER NOT NULL,
    `nilai_k` INTEGER NOT NULL,
    `status` ENUM('PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'COMPLETED',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sesi_clustering_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_sesi_clustering` (
    `id` VARCHAR(191) NOT NULL,
    `id_sesi` VARCHAR(191) NOT NULL,
    `id_siswa` VARCHAR(191) NULL,
    `nama_siswa` VARCHAR(191) NOT NULL,
    `nis_siswa` VARCHAR(191) NOT NULL,
    `bulan_terbayar` INTEGER NOT NULL,
    `hari_keterlambatan` INTEGER NOT NULL,
    `nomor_cluster` INTEGER NOT NULL,
    `label_cluster` VARCHAR(191) NOT NULL,
    `jarak_ke_pusat` DOUBLE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `item_sesi_clustering_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ringkasan_clustering` (
    `id` VARCHAR(191) NOT NULL,
    `id_sesi` VARCHAR(191) NOT NULL,
    `total_cluster` INTEGER NOT NULL,
    `data_ringkasan` JSON NOT NULL,
    `parameter_algoritma` JSON NOT NULL,
    `skor_performa` DOUBLE NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ringkasan_clustering_id_key`(`id`),
    UNIQUE INDEX `ringkasan_clustering_id_sesi_key`(`id_sesi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `item_sesi_clustering` ADD CONSTRAINT `item_sesi_clustering_id_sesi_fkey` FOREIGN KEY (`id_sesi`) REFERENCES `sesi_clustering`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_sesi_clustering` ADD CONSTRAINT `item_sesi_clustering_id_siswa_fkey` FOREIGN KEY (`id_siswa`) REFERENCES `siswa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ringkasan_clustering` ADD CONSTRAINT `ringkasan_clustering_id_sesi_fkey` FOREIGN KEY (`id_sesi`) REFERENCES `sesi_clustering`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
