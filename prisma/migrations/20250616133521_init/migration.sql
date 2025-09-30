-- CreateTable
CREATE TABLE `admins` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'HEAD_MASTER') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `siswa` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nis` VARCHAR(191) NOT NULL,
    `nisn` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `tanggal_lahir` DATETIME(3) NOT NULL,
    `tahun_akademik` VARCHAR(191) NOT NULL,
    `id_spp` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `siswa_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spp` (
    `id` VARCHAR(191) NOT NULL,
    `tahun_akademik` VARCHAR(191) NOT NULL,
    `biaya` DOUBLE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `spp_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembayaran` (
    `id` VARCHAR(191) NOT NULL,
    `id_siswa` VARCHAR(191) NOT NULL,
    `jumlah_pembayaran` DOUBLE NOT NULL,
    `tanggal_pembayaran` DATETIME(3) NOT NULL,
    `tanggal_jatuh_tempo` DATETIME(3) NOT NULL,
    `bulan` VARCHAR(191) NOT NULL,
    `tahun` VARCHAR(191) NOT NULL,
    `status_pembayaran` ENUM('LUNAS', 'BELUM_BAYAR') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pembayaran_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cluster` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cluster_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clustering` (
    `id` VARCHAR(191) NOT NULL,
    `id_siswa` VARCHAR(191) NOT NULL,
    `id_cluster` VARCHAR(191) NOT NULL,
    `frekuensi_pembayaran` DOUBLE NOT NULL,
    `nama_cluster` VARCHAR(191) NOT NULL,
    `status_pembayaran` ENUM('LUNAS', 'BELUM_BAYAR') NOT NULL,
    `keterlambatan` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `clustering_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hasil_clustering` (
    `id` VARCHAR(191) NOT NULL,
    `id_siswa` VARCHAR(191) NOT NULL,
    `id_cluster` VARCHAR(191) NOT NULL,
    `id_clustering` VARCHAR(191) NOT NULL,
    `frekuensi_pembayaran` DOUBLE NOT NULL,
    `nama_cluster` VARCHAR(191) NOT NULL,
    `status_pembayaran` ENUM('LUNAS', 'BELUM_BAYAR') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hasil_clustering_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `siswa` ADD CONSTRAINT `siswa_id_spp_fkey` FOREIGN KEY (`id_spp`) REFERENCES `spp`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_id_siswa_fkey` FOREIGN KEY (`id_siswa`) REFERENCES `siswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clustering` ADD CONSTRAINT `clustering_id_siswa_fkey` FOREIGN KEY (`id_siswa`) REFERENCES `siswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clustering` ADD CONSTRAINT `clustering_id_cluster_fkey` FOREIGN KEY (`id_cluster`) REFERENCES `cluster`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_clustering` ADD CONSTRAINT `hasil_clustering_id_siswa_fkey` FOREIGN KEY (`id_siswa`) REFERENCES `siswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_clustering` ADD CONSTRAINT `hasil_clustering_id_cluster_fkey` FOREIGN KEY (`id_cluster`) REFERENCES `cluster`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_clustering` ADD CONSTRAINT `hasil_clustering_id_clustering_fkey` FOREIGN KEY (`id_clustering`) REFERENCES `clustering`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
