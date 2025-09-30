"use client";

import { createAcademicYear } from "@/actions/academic-years";
import Link from "next/link";
import { useActionState } from "react";

export default function NewAcademicYearPage() {
  const [, action] = useActionState(createAcademicYear, {
    error: null,
  });
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/academic-years" className="text-blue-500 hover:underline">
          &larr; Kembali
        </Link>
        <h1 className="text-2xl font-bold">Tambah Tahun Akademik Baru</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="year" className="block mb-2 font-medium">
              Tahun Akademik (Format: 2023/2024)
            </label>
            <input
              type="text"
              id="year"
              name="year"
              placeholder="Contoh: 2023/2024"
              className="w-full p-2 border rounded"
              required
              pattern="\d{4}\/\d{4}"
              title="Format: 2023/2024"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block mb-2 font-medium">
                Tanggal Mulai
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block mb-2 font-medium">
                Tanggal Selesai
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Link
              href="/academic-years"
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Simpan Tahun Akademik
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
