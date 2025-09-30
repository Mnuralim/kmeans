/*
  Warnings:

  - Added the required column `nomor_pembayaran` to the `pembayaran` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pembayaran` ADD COLUMN `nomor_pembayaran` VARCHAR(191) NOT NULL;
