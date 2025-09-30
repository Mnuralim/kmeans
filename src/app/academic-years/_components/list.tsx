"use client";

import { Modal } from "@/app/_components/modal";
import { Tabel, type TabelColumn } from "@/app/_components/tabel";
import { formatDate } from "@/lib/utils";
import type { AcademicYear } from "@prisma/client";
import { CheckCircle2, Edit, Plus } from "lucide-react";
import React, { useState } from "react";
import { Alert } from "@/app/_components/alert";
import { useRouter } from "next/navigation";
import { setCurrentAcademicYear } from "@/actions/academic-years";
import { AcademicYearForm } from "./form";

interface Props {
  alertType?: "success" | "error";
  message?: string;
  academicYears: AcademicYear[];
}

export const AcademicYearsList = ({
  alertType,
  academicYears,
  message,
}: Props) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYear | null>(null);
  const router = useRouter();

  const handleOpenModal = (educationFee?: AcademicYear) => {
    setIsOpenModal(true);
    if (educationFee) {
      setSelectedAcademicYear(educationFee);
    }
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
    setSelectedAcademicYear(null);
  };

  const handleCloseAlert = () => {
    router.replace("/academic-years", { scroll: false });
  };

  const tabel: TabelColumn<AcademicYear>[] = [
    {
      header: "No",
      accessor: "id",
      render: (_, index) => (index as number) + 1,
    },
    {
      header: "Tahun Akademik",
      accessor: (item) => item.year || "-",
    },
    {
      header: "Periode",
      accessor: (item) =>
        `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`,
    },
    {
      header: "Status",
      accessor: (item) => item.isActive,
      render: (item) =>
        item.isCurrent ? (
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Aktif
          </span>
        ) : (
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            Non-Aktif
          </span>
        ),
    },

    {
      header: "Aksi",
      accessor: (item) => (
        <div className="flex items-center gap-2">
          {!item.isCurrent && (
            <form
              action={async () => {
                await setCurrentAcademicYear(item.id);
              }}
            >
              <button
                type="submit"
                className="w-8 h-8 inline-flex items-center justify-center rounded-md bg-green-500 text-white hover:bg-green-600 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}
          <button
            onClick={() => handleOpenModal(item)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-200"
            title="Edit Data"
          >
            <Edit className="w-4 h-4" />
          </button>
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
      <Tabel columns={tabel} data={academicYears} />
      <Modal isOpen={isOpenModal} onClose={handleCloseModal}>
        <AcademicYearForm
          modal={selectedAcademicYear ? "edit" : "add"}
          onClose={handleCloseModal}
          selectedAcademicYear={selectedAcademicYear}
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
