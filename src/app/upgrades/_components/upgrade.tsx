"use client";

import { executeClassUpgrade, prepareClassUpgrade } from "@/actions/upgrade";
import { Alert } from "@/app/_components/alert";
import type { AcademicYear } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useActionState } from "react";

interface Props {
  stats: {
    currentYear: AcademicYear | null;
    totalStudents: number;
    preparedStudents: number;
    nextYear: string | null;
  };
  alertType?: "success" | "error";
  message?: string;
}

export const Upgrade = ({ stats, alertType, message }: Props) => {
  const [, prepareAction, preparePending] = useActionState(
    prepareClassUpgrade,
    undefined
  );
  const [, executeAction, executePending] = useActionState(
    executeClassUpgrade,
    undefined
  );

  const router = useRouter();

  const handleCloseAlert = () => {
    router.replace("/upgrades", { scroll: false });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Status Transisi</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border p-4 rounded">
          <h3 className="font-medium">Tahun Akademik Saat Ini</h3>
          <p className="text-2xl mt-2">{stats.currentYear?.year || "-"}</p>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-medium">Tahun Akademik Berikutnya</h3>
          <p className="text-2xl mt-2">{stats.nextYear || "-"}</p>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-medium">Siswa Siap Dipindahkan</h3>
          <p className="text-2xl mt-2">
            {stats.preparedStudents} / {stats.totalStudents}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <form action={prepareAction}>
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-yellow-300 disabled:text-gray-500"
            disabled={!stats.currentYear || preparePending}
          >
            {!preparePending ? "Siapkan Transisi" : "Siapkan Transisi..."}
          </button>
        </form>

        <form action={executeAction}>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-green-300 disabled:text-gray-500"
            disabled={
              stats.preparedStudents === 0 || !stats.nextYear || executePending
            }
          >
            {!executePending ? "Jalankan Transisi" : "Jalankan Transisi..."}
          </button>
        </form>
      </div>
      <Alert
        isVisible={message !== undefined}
        message={message || ""}
        onClose={handleCloseAlert}
        type={alertType || "success"}
        autoClose
      />
    </div>
  );
};
