/*
  Warnings:

  - You are about to drop the column `agustus` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `april` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_agustus` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_april` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_desember` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_februari` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_januari` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_juli` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_juni` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_maret` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_mei` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_november` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_oktober` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `centroid_september` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `desember` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `februari` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `januari` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `juli` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `juni` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `maret` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `mei` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `november` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `oktober` on the `hasil_clustering` table. All the data in the column will be lost.
  - You are about to drop the column `september` on the `hasil_clustering` table. All the data in the column will be lost.
  - Added the required column `centroids` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pembayaran_bulanan` to the `hasil_clustering` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hasil_clustering` DROP COLUMN `agustus`,
    DROP COLUMN `april`,
    DROP COLUMN `centroid_agustus`,
    DROP COLUMN `centroid_april`,
    DROP COLUMN `centroid_desember`,
    DROP COLUMN `centroid_februari`,
    DROP COLUMN `centroid_januari`,
    DROP COLUMN `centroid_juli`,
    DROP COLUMN `centroid_juni`,
    DROP COLUMN `centroid_maret`,
    DROP COLUMN `centroid_mei`,
    DROP COLUMN `centroid_november`,
    DROP COLUMN `centroid_oktober`,
    DROP COLUMN `centroid_september`,
    DROP COLUMN `desember`,
    DROP COLUMN `februari`,
    DROP COLUMN `januari`,
    DROP COLUMN `juli`,
    DROP COLUMN `juni`,
    DROP COLUMN `maret`,
    DROP COLUMN `mei`,
    DROP COLUMN `november`,
    DROP COLUMN `oktober`,
    DROP COLUMN `september`,
    ADD COLUMN `centroids` JSON NOT NULL,
    ADD COLUMN `pembayaran_bulanan` JSON NOT NULL;
