"use client";

import { Modal } from "@/app/_components/modal";
import { Tabel, type TabelColumn } from "@/app/_components/tabel";
import { formatCurrency } from "@/lib/utils";
import type { AcademicYear, Prisma } from "@prisma/client";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { EducationFeeForm } from "./education-fee-form";
import { Alert } from "@/app/_components/alert";
import { useRouter } from "next/navigation";
import { deleteEducationFee } from "@/actions/education-fees";

export type EducationFeeWithAcademicYear = Prisma.EducationFeeGetPayload<{
  include: {
    academicYear: true;
  };
}>;

interface Props {
  educationFees: EducationFeeWithAcademicYear[];
  alertType?: "success" | "error";
  message?: string;
  academicYears: AcademicYear[];
}

export const EducationFeeList = ({
  educationFees,
  alertType,
  academicYears,
  message,
}: Props) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedEducationFee, setSelectedEducationFee] =
    useState<EducationFeeWithAcademicYear | null>(null);
  const router = useRouter();

  const handleOpenModal = (educationFee?: EducationFeeWithAcademicYear) => {
    setIsOpenModal(true);
    if (educationFee) {
      setSelectedEducationFee(educationFee);
    }
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
    setSelectedEducationFee(null);
  };

  const handleCloseAlert = () => {
    router.replace("/education-fees", { scroll: false });
  };

  const tabel: TabelColumn<EducationFeeWithAcademicYear>[] = [
    {
      header: "No",
      accessor: "id",
      render: (_, index) => (index as number) + 1,
    },
    {
      header: "Tahun Ajaran",
      accessor: (item) => item.academicYear.year || "-",
    },
    {
      header: "Biaya SPP",
      accessor: (item) => formatCurrency(item.fee) || 0,
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
          <form
            action={() => deleteEducationFee(item.id)}
            className="inline-block"
          >
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
          Tambah Data
        </button>
      </div>
      <Tabel columns={tabel} data={educationFees} />
      <Modal isOpen={isOpenModal} onClose={handleCloseModal}>
        <EducationFeeForm
          academicYears={academicYears}
          modal={selectedEducationFee ? "edit" : "add"}
          onClose={handleCloseModal}
          selectedEducationFee={selectedEducationFee}
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
