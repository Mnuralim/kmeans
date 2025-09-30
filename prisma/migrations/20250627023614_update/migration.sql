/*
  Warnings:

  - You are about to drop the `item_sesi_clustering` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ringkasan_clustering` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sesi_clustering` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `item_sesi_clustering` DROP FOREIGN KEY `item_sesi_clustering_id_sesi_fkey`;

-- DropForeignKey
ALTER TABLE `item_sesi_clustering` DROP FOREIGN KEY `item_sesi_clustering_id_siswa_fkey`;

-- DropForeignKey
ALTER TABLE `ringkasan_clustering` DROP FOREIGN KEY `ringkasan_clustering_id_sesi_fkey`;

-- DropTable
DROP TABLE `item_sesi_clustering`;

-- DropTable
DROP TABLE `ringkasan_clustering`;

-- DropTable
DROP TABLE `sesi_clustering`;

-- CreateTable
CREATE TABLE `riwayat_clustering` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `nama_file` VARCHAR(191) NOT NULL,
    `jumlah_siswa` INTEGER NOT NULL,
    `maksimal_iterasi` INTEGER NOT NULL,
    `iterasi_aktual` INTEGER NOT NULL,
    `konvergen` BOOLEAN NOT NULL,
    `status` ENUM('COMPLETED', 'FAILED', 'PROCESSING') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `riwayat_clustering_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clusters` (
    `id` VARCHAR(191) NOT NULL,
    `id_clustering_history` VARCHAR(191) NOT NULL,
    `indeks_cluster` INTEGER NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `centroid_januari` DOUBLE NOT NULL,
    `centroid_februari` DOUBLE NOT NULL,
    `centroid_maret` DOUBLE NOT NULL,
    `jumlah_titik` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `clusters_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hasil_clustering` (
    `id` VARCHAR(191) NOT NULL,
    `id_clustering_history` VARCHAR(191) NOT NULL,
    `id_cluster` VARCHAR(191) NOT NULL,
    `id_siswa` VARCHAR(191) NULL,
    `nama_siswa` VARCHAR(191) NOT NULL,
    `nis` VARCHAR(191) NOT NULL,
    `kelas` INTEGER NOT NULL,
    `spp` INTEGER NOT NULL,
    `januari` INTEGER NOT NULL,
    `februari` INTEGER NOT NULL,
    `maret` INTEGER NOT NULL,
    `label_cluster` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hasil_clustering_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clusters` ADD CONSTRAINT `clusters_id_clustering_history_fkey` FOREIGN KEY (`id_clustering_history`) REFERENCES `riwayat_clustering`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_clustering` ADD CONSTRAINT `hasil_clustering_id_clustering_history_fkey` FOREIGN KEY (`id_clustering_history`) REFERENCES `riwayat_clustering`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_clustering` ADD CONSTRAINT `hasil_clustering_id_cluster_fkey` FOREIGN KEY (`id_cluster`) REFERENCES `clusters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_clustering` ADD CONSTRAINT `hasil_clustering_id_siswa_fkey` FOREIGN KEY (`id_siswa`) REFERENCES `siswa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
