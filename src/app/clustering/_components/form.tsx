"use client";
import { submitClustering } from "@/actions/clustering";
import Link from "next/link";
import React, { useActionState, useState } from "react";

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const ClusteringForm = () => {
  const [state, action, isPending] = useActionState(submitClustering, {
    data: [],
  });
  const [selectedMonths, setSelectedMonths] = useState<string[]>([
    "Januari",
    "Februari",
    "Maret",
  ]);

  const handleMonthChange = (index: number, value: string) => {
    const newSelectedMonths = [...selectedMonths];
    newSelectedMonths[index] = value;
    setSelectedMonths(newSelectedMonths);
  };

  return (
    <>
      <form action={action} className="mb-8">
        <input type="hidden" name="month1" value={selectedMonths[0]} />
        <input type="hidden" name="month2" value={selectedMonths[1]} />
        <input type="hidden" name="month3" value={selectedMonths[2]} />

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 grid">
          <div className="grid grid-cols-2 gap-5 mb-4 items-center">
            <div className="">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload File CSV
              </label>
              <input
                name="file"
                type="file"
                accept=".csv"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                File CSV harus berisi kolom: Nama Siswa, NIS, Kelas, SPP, dan
                minimal 3 bulan pembayaran
              </p>
            </div>
            <div className="w-full">
              <label
                htmlFor="max_iterations"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Iterasi Maksimal
              </label>
              <input
                type="number"
                placeholder="Iterasi Maksimal"
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="max_iterations"
                min={1}
                max={1000}
                defaultValue={100}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih 3 Bulan untuk Clustering
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <select
                  key={index}
                  value={selectedMonths[index]}
                  onChange={(e) => handleMonthChange(index, e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {months
                    .filter(
                      (month) =>
                        !selectedMonths.includes(month) ||
                        month === selectedMonths[index]
                    )
                    .map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                </select>
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Harus memilih tepat 3 bulan yang berbeda
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="clustering_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nama Clustering
            </label>
            <input
              type="text"
              placeholder="Nama Clustering"
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="clustering_name"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Deskripsi (Opsional)
            </label>
            <textarea
              placeholder="Deskripsi clustering"
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="description"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Memproses..." : "Mulai Clustering"}
          </button>
        </div>
      </form>
      {state?.success === false && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{state.message}</p>
        </div>
      )}
      {state?.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">{state.message}</p>
          {state.clusteringHistoryId && (
            <p className="text-green-800 mt-2">
              ID Clustering: {state.clusteringHistoryId}
            </p>
          )}
        </div>
      )}
      {state.clusteringHistoryId && (
        <Link
          href={`/results/${state.clusteringHistoryId}`}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Lihat Hasil Clustering
        </Link>
      )}
    </>
  );
};
