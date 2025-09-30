/*
  Warnings:

  - You are about to drop the `riwayat_upgrade_kelas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `riwayat_upgrade_kelas` DROP FOREIGN KEY `riwayat_upgrade_kelas_id_siswa_fkey`;

-- DropTable
DROP TABLE `riwayat_upgrade_kelas`;
