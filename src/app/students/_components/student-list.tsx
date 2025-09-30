"use client";

import { Modal } from "@/app/_components/modal";
import { Tabel, type TabelColumn } from "@/app/_components/tabel";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { AcademicYear, Prisma } from "@prisma/client";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { StudentForm } from "./form";
import { Alert } from "@/app/_components/alert";
import { useRouter } from "next/navigation";
import { deleteStudent } from "@/actions/students";
import type { EducationFeeWithAcademicYear } from "@/app/education-fees/_components/education-fee-list";
import { StudentFilterControl } from "./filter-controll";
import { Pagination } from "@/app/_components/pagination";

export type StudentWithFee = Prisma.StudentGetPayload<{
  include: {
    educationFee: true;
    academicYear: true;
  };
}>;

interface Props {
  students: StudentWithFee[];
  academicYears: AcademicYear[];
  educationFees: EducationFeeWithAcademicYear[];
  pagination: PaginationProps;
  alertType?: "success" | "error";
  message?: string;
}

export const StudentList = ({
  students,
  pagination,
  educationFees,
  academicYears,
  alertType,
  message,
}: Props) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithFee | null>(
    null
  );
  const router = useRouter();

  const handleOpenModal = (student?: StudentWithFee) => {
    setIsOpenModal(true);
    if (student) {
      setSelectedStudent(student);
    }
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
    setSelectedStudent(null);
  };

  const handleCloseAlert = () => {
    router.replace("/students", { scroll: false });
  };

  const columns: TabelColumn<StudentWithFee>[] = [
    {
      header: "No",
      accessor: "id",
      render: (_, index) => (index as number) + 1,
    },
    {
      header: "Nama",
      accessor: (item) => item.name || "-",
    },
    {
      header: "NIS",
      accessor: (item) => item.nis || "-",
    },
    {
      header: "NISN",
      accessor: (item) => item.nisn || "-",
    },
    {
      header: "Kelas",
      accessor: (item) => item.grade || "-",
    },
    {
      header: "Tanggal Lahir",
      accessor: (item) =>
        item.birthDate ? formatDate(new Date(item.birthDate)) : "-",
    },
    {
      header: "Tahun Ajaran Masuk",
      accessor: (item) => item.academicYear?.year || "-",
    },
    {
      header: "Biaya SPP",
      accessor: (item) => formatCurrency(item.educationFee.fee) || 0,
    },
    {
      header: "Aksi",
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(item)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-200"
            title="Edit Data"
          >
            <Edit className="w-4 h-4" />
          </button>
          <form action={() => deleteStudent(item.id)} className="inline-block">
            <button
              type="submit"
              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200"
              title="Hapus Data"
              onClick={(e) => {
                if (
                  !confirm(
                    "Apakah Anda yakin ingin menghapus data penduduk ini?"
                  )
                ) {
                  e.preventDefault();
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors duration-150 shadow-sm border border-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Siswa
        </button>
      </div>
      <StudentFilterControl
        currentSortOrder={pagination?.preserveParams?.sortOrder as string}
      />
      <Tabel columns={columns} data={students} />
      <div className="mt-8">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          preserveParams={pagination.preserveParams}
        />
      </div>
      <Modal isOpen={isOpenModal} onClose={handleCloseModal}>
        <StudentForm
          educationFees={educationFees}
          modal={selectedStudent ? "edit" : "add"}
          selectedStudent={selectedStudent}
          onClose={handleCloseModal}
          academicYears={academicYears}
        />
      </Modal>
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
