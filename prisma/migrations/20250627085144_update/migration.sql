/*
  Warnings:

  - You are about to drop the column `centroid_februari` on the `clusters` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_januari` on the `clusters` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_maret` on the `clusters` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `clusters` table. All the data in the column will be lost.
  - You are about to drop the column `id_clustering_history` on the `clusters` table. All the data in the column will be lost.
  - You are about to drop the column `indeks_cluster` on the `clusters` table. All the data in the column will be lost.
  - You are about to drop the column `jumlah_titik` on the `clusters` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `clusters` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `id_cluster` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `id_clustering_history` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `id_siswa` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `kelas` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `label_cluster` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `nama_siswa` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `deskripsi` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `iterasi_aktual` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `jumlah_siswa` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `konvergen` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `maksimal_iterasi` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `nama_file` on the `riwayat_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `riwayat_clustering` table. All the data in the column will be lost.
  - Added the required column `centroidFebruari` to the `clusters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `centroidJanuari` to the `clusters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `centroidMaret` to the `clusters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clusterIndex` to the `clusters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clusteringHistoryId` to the `clusters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPoints` to the `clusters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `clusters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clusterId` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clusterLabel` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clusteringHistoryId` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentName` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualIterations` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isConverged` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxIterations` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalStudents` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `riwayat_clustering` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `clusters` DROP FOREIGN KEY `clusters_id_clustering_history_fkey`;

-- DropForeignKey
ALTER TABLE `hasil_clustering` DROP FOREIGN KEY `hasil_clustering_id_cluster_fkey`;

-- DropForeignKey
ALTER TABLE `hasil_clustering` DROP FOREIGN KEY `hasil_clustering_id_clustering_history_fkey`;

-- DropForeignKey
ALTER TABLE `hasil_clustering` DROP FOREIGN KEY `hasil_clustering_id_siswa_fkey`;

-- DropIndex
DROP INDEX `clusters_id_clustering_history_fkey` ON `clusters`;

-- DropIndex
DROP INDEX `hasil_clustering_id_cluster_fkey` ON `hasil_clustering`;

-- DropIndex
DROP INDEX `hasil_clustering_id_clustering_history_fkey` ON `hasil_clustering`;

-- DropIndex
DROP INDEX `hasil_clustering_id_siswa_fkey` ON `hasil_clustering`;

-- AlterTable
ALTER TABLE `clusters` DROP COLUMN `centroid_februari`,
    DROP COLUMN `centroid_januari`,
    DROP COLUMN `centroid_maret`,
    DROP COLUMN `created_at`,
    DROP COLUMN `id_clustering_history`,
    DROP COLUMN `indeks_cluster`,
    DROP COLUMN `jumlah_titik`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `centroidFebruari` DOUBLE NOT NULL,
    ADD COLUMN `centroidJanuari` DOUBLE NOT NULL,
    ADD COLUMN `centroidMaret` DOUBLE NOT NULL,
    ADD COLUMN `clusterIndex` INTEGER NOT NULL,
    ADD COLUMN `clusteringHistoryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `totalPoints` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `hasil_clustering` DROP COLUMN `created_at`,
    DROP COLUMN `id_cluster`,
    DROP COLUMN `id_clustering_history`,
    DROP COLUMN `id_siswa`,
    DROP COLUMN `kelas`,
    DROP COLUMN `label_cluster`,
    DROP COLUMN `nama_siswa`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `clusterId` VARCHAR(191) NOT NULL,
    ADD COLUMN `clusterLabel` VARCHAR(191) NOT NULL,
    ADD COLUMN `clusteringHistoryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `grade` INTEGER NOT NULL,
    ADD COLUMN `studentId` VARCHAR(191) NULL,
    ADD COLUMN `studentName` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `riwayat_clustering` DROP COLUMN `created_at`,
    DROP COLUMN `deskripsi`,
    DROP COLUMN `iterasi_aktual`,
    DROP COLUMN `jumlah_siswa`,
    DROP COLUMN `konvergen`,
    DROP COLUMN `maksimal_iterasi`,
    DROP COLUMN `nama`,
    DROP COLUMN `nama_file`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `actualIterations` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `fileName` VARCHAR(191) NOT NULL,
    ADD COLUMN `isConverged` BOOLEAN NOT NULL,
    ADD COLUMN `maxIterations` INTEGER NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `totalStudents` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `clusters` ADD CONSTRAINT `clusters_clusteringHistoryId_fkey` FOREIGN KEY (`clusteringHistoryId`) REFERENCES `riwayat_clustering`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_clustering` ADD CONSTRAINT `hasil_clustering_clusteringHistoryId_fkey` FOREIGN KEY (`clusteringHistoryId`) REFERENCES `riwayat_clustering`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_clustering` ADD CONSTRAINT `hasil_clustering_clusterId_fkey` FOREIGN KEY (`clusterId`) REFERENCES `clusters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_clustering` ADD CONSTRAINT `hasil_clustering_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `siswa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
