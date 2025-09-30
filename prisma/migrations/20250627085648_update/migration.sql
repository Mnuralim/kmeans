/*
  Warnings:

  - You are about to drop the column `clusterId` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `clusterLabel` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `clusteringHistoryId` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `studentName` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `actualIterations` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `isConverged` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `maxIterations` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `totalStudents` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the `clusters` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `centroid_februari` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `centroid_januari` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `centroid_maret` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_clustering_history` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indeks_cluster` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kelas` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label_cluster` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_siswa` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_clustering` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iterasi_aktual` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jumlah_siswa` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `konvergen` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maksimal_iterasi` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_file` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `clusters` DROP FOREIGN KEY `clusters_clusteringHistoryId_fkey`;

-- DropForeignKey
ALTER TABLE `hasil_clustering` DROP FOREIGN KEY `hasil_clustering_clusterId_fkey`;

-- DropForeignKey
ALTER TABLE `hasil_clustering` DROP FOREIGN KEY `hasil_clustering_clusteringHistoryId_fkey`;

-- DropForeignKey
ALTER TABLE `hasil_clustering` DROP FOREIGN KEY `hasil_clustering_studentId_fkey`;

-- DropIndex
DROP INDEX `hasil_clustering_clusterId_fkey` ON `hasil_clustering`;

-- DropIndex
DROP INDEX `hasil_clustering_clusteringHistoryId_fkey` ON `hasil_clustering`;

-- DropIndex
DROP INDEX `hasil_clustering_studentId_fkey` ON `hasil_clustering`;

-- AlterTable
ALTER TABLE `hasil_clustering` DROP COLUMN `clusterId`,
    DROP COLUMN `clusterLabel`,
    DROP COLUMN `clusteringHistoryId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `grade`,
    DROP COLUMN `studentId`,
    DROP COLUMN `studentName`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `centroid_februari` DOUBLE NOT NULL,
    ADD COLUMN `centroid_januari` DOUBLE NOT NULL,
    ADD COLUMN `centroid_maret` DOUBLE NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id_clustering_history` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_siswa` VARCHAR(191) NULL,
    ADD COLUMN `indeks_cluster` INTEGER NOT NULL,
    ADD COLUMN `kelas` INTEGER NOT NULL,
    ADD COLUMN `label_cluster` VARCHAR(191) NOT NULL,
    ADD COLUMN `nama_siswa` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `riwayat_clustering` DROP COLUMN `actualIterations`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `description`,
    DROP COLUMN `fileName`,
    DROP COLUMN `isConverged`,
    DROP COLUMN `maxIterations`,
    DROP COLUMN `name`,
    DROP COLUMN `totalStudents`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `data_clustering` JSON NOT NULL,
    ADD COLUMN `deskripsi` VARCHAR(191) NULL,
    ADD COLUMN `iterasi_aktual` INTEGER NOT NULL,
    ADD COLUMN `jumlah_siswa` INTEGER NOT NULL,
    ADD COLUMN `konvergen` BOOLEAN NOT NULL,
    ADD COLUMN `maksimal_iterasi` INTEGER NOT NULL,
    ADD COLUMN `nama` VARCHAR(191) NOT NULL,
    ADD COLUMN `nama_file` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `clusters`;

-- CreateIndex
CREATE INDEX `hasil_clustering_id_clustering_history_indeks_cluster_idx` ON `hasil_clustering`(`id_clustering_history`, `indeks_cluster`);

-- AddForeignKey
ALTER TABLE `hasil_clustering` ADD CONSTRAINT `hasil_clustering_id_clustering_history_fkey` FOREIGN KEY (`id_clustering_history`) REFERENCES `riwayat_clustering`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_clustering` ADD CONSTRAINT `hasil_clustering_id_siswa_fkey` FOREIGN KEY (`id_siswa`) REFERENCES `siswa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
