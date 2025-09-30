import {
  createAcademicYear,
  updateAcademicYear,
} from "@/actions/academic-years";
import { ErrorMessage } from "@/app/_components/error-message";
import { Calendar } from "lucide-react";
import Form from "next/form";
import React, { useActionState } from "react";
import type { AcademicYear } from "@prisma/client";

interface Props {
  modal: "add" | "edit";
  selectedAcademicYear?: AcademicYear | null;
  onClose: () => void;
}

export const AcademicYearForm = ({
  modal,
  selectedAcademicYear,
  onClose,
}: Props) => {
  const [state, action, pending] = useActionState(
    selectedAcademicYear ? updateAcademicYear : createAcademicYear,
    {
      error: null,
    }
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {modal === "add" ? "Tambah Tahun Akademik" : "Edit Tahun Akademik"}
        </h2>
        <p className="text-sm text-gray-600">
          {modal === "add"
            ? "Lengkapi informasi untuk menambahkan tahun akademik baru"
            : "Perbarui informasi tahun akademik sesuai kebutuhan"}
        </p>
      </div>

      <Form action={action} className="space-y-6">
        <input
          type="hidden"
          name="id"
          defaultValue={selectedAcademicYear?.id || ""}
        />
        <ErrorMessage message={state.error} />

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Informasi Tahun Akademik
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tahun Akademik *
              </label>
              <input
                type="text"
                id="year"
                name="year"
                defaultValue={selectedAcademicYear?.year || ""}
                placeholder="2024/2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Format: YYYY/YYYY (contoh: 2024/2025)
              </p>
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tanggal Mulai *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                defaultValue={
                  selectedAcademicYear?.startDate
                    ? new Date(selectedAcademicYear.startDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                required
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tanggal Selesai *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                defaultValue={
                  selectedAcademicYear?.endDate
                    ? new Date(selectedAcademicYear.endDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            type="button"
            className="w-full sm:w-auto px-6 py-2.5 bg-white text-gray-700 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-150"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={pending}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {pending ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : modal === "add" ? (
              "Tambah Tahun Akademik"
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </div>
      </Form>
    </div>
  );
};
