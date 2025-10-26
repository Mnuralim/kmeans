import { ErrorMessage } from "@/app/_components/error-message";
import { User, GraduationCap, DollarSign } from "lucide-react";
import Form from "next/form";
import React, { useActionState } from "react";
import type { StudentWithFee } from "./student-list";
import { createStudent, updateStudent } from "@/actions/students";
import type { AcademicYear } from "@prisma/client";
import type { EducationFeeWithAcademicYear } from "@/app/education-fees/_components/education-fee-list";

interface Props {
  modal: "add" | "edit";
  selectedStudent?: StudentWithFee | null;
  educationFees?: EducationFeeWithAcademicYear[];
  academicYears?: AcademicYear[];
  onClose: () => void;
}

export const StudentForm = ({
  modal,
  selectedStudent,
  educationFees = [],
  academicYears,
  onClose,
}: Props) => {
  const [state, action, pending] = useActionState(
    selectedStudent ? updateStudent : createStudent,
    {
      error: null,
    }
  );
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {modal === "add" ? "Tambah Siswa Baru" : "Edit Data Siswa"}
        </h2>
        <p className="text-sm text-gray-600">
          {modal === "add"
            ? "Lengkapi informasi siswa untuk menambahkan data baru"
            : "Perbarui informasi siswa sesuai kebutuhan"}
        </p>
      </div>

      <Form action={action} className="space-y-6">
        <input
          type="hidden"
          name="id"
          defaultValue={selectedStudent?.id || ""}
        />
        <ErrorMessage message={state.error} />

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Informasi Identitas
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={selectedStudent?.name || ""}
                placeholder="Nama lengkap siswa"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                required
              />
            </div>

            <div>
              <label
                htmlFor="nis"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                NIS *
              </label>
              <input
                type="text"
                id="nis"
                name="nis"
                minLength={4}
                maxLength={4}
                defaultValue={selectedStudent?.nis || ""}
                placeholder="Nomor Induk Siswa"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 font-mono"
                required
              />
            </div>

            <div>
              <label
                htmlFor="nisn"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                NISN *
              </label>
              <input
                type="text"
                id="nisn"
                name="nisn"
                minLength={10}
                maxLength={10}
                defaultValue={selectedStudent?.nisn || ""}
                placeholder="Nomor Induk Siswa Nasional"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 font-mono"
                required
              />
            </div>

            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tanggal Lahir *
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                defaultValue={
                  selectedStudent?.birthDate
                    ? new Date(selectedStudent.birthDate)
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

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <GraduationCap className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Informasi Akademik
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="grade"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Kelas *
              </label>
              <select
                id="grade"
                name="grade"
                defaultValue={selectedStudent?.grade || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                required
              >
                <option value="">Pilih kelas</option>
                <option value="1">Kelas 1</option>
                <option value="2">Kelas 2</option>
                <option value="3">Kelas 3</option>
                <option value="4">Kelas 4</option>
                <option value="5">Kelas 5</option>
                <option value="6">Kelas 6</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="academicYearId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tahun Ajaran Masuk *
              </label>
              <select
                id="academicYearId"
                name="academicYearId"
                defaultValue={selectedStudent?.academicYearId || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                required
              >
                <option value="">Pilih tahun akademik</option>
                {academicYears?.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Biaya SPP</h3>
          </div>

          <div>
            <label
              htmlFor="educationFeeId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pilih Biaya SPP *
            </label>
            <select
              id="educationFeeId"
              name="educationFeeId"
              defaultValue={selectedStudent?.educationFeeId || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
              required
            >
              <option value="">Pilih biaya SPP</option>
              {educationFees.map((fee) => (
                <option key={fee.id} value={fee.id}>
                  {fee.academicYear.year} - Rp {fee.fee.toLocaleString("id-ID")}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Pilih biaya SPP sesuai dengan tahun akademik
            </p>
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
              "Tambah Siswa"
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </div>
      </Form>
    </div>
  );
};
