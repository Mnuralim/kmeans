"use client";
import { Alert } from "@/app/_components/alert";
import { Modal } from "@/app/_components/modal";
import { Tabel, type TabelColumn } from "@/app/_components/tabel";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { AcademicYear, Payment, Prisma } from "@prisma/client";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { ConfirmForm } from "./confirm-form";

type StudentWithPayment = Prisma.StudentGetPayload<{
  include: {
    payments: true;
    educationFee: true;
    academicYear: true;
  };
}>;

interface Props {
  student: StudentWithPayment;
  alertType?: "success" | "error";
  message?: string;
  currentAcademicYearFilter?: string;
  academicYears: AcademicYear[];
}

export const PaymentDetail = ({
  student,
  alertType,
  message,
  currentAcademicYearFilter,
  academicYears,
}: Props) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOpenConfirmPaymentModal = (id: string) => {
    setIsConfirmModalOpen(true);
    setSelectedPaymentId(id);
  };

  const handleCloseConfirmPaymentModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedPaymentId(null);
  };

  const handleCloseAlert = () => {
    router.replace(`/payments/${student.nis}`, { scroll: false });
  };

  const handleAcademicYearChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedYear = e.target.value;
    const newParams = new URLSearchParams(searchParams);

    if (selectedYear === "all") {
      newParams.delete("academicYear");
    } else {
      newParams.set("academicYear", selectedYear);
    }

    router.replace(`/payments/${student.nis}?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const columns: TabelColumn<Payment>[] = [
    {
      header: "Periode",
      accessor: (item) => `${item.month} ${item.year}` || "-",
    },
    {
      header: "No Pembayaran",
      accessor: (item) => item.paymentNumber || "-",
    },
    {
      header: "Tanggal Bayar",
      accessor: (item) =>
        item.paymentDate ? formatDate(new Date(item.paymentDate)) : "-",
    },
    {
      header: "Jatuh Tempo",
      accessor: (item) => formatDate(new Date(item.dueDate)) || "-",
    },
    {
      header: "Biaya SPP",
      accessor: (item) => formatCurrency(item.totalAmount),
    },
    {
      header: "Status",
      accessor: (item) => item.status || "-",
    },
    {
      header: "Tahun Ajaran",
      accessor: (item) => item.academicYear || "-",
    },
    {
      header: "Aksi",
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <button
            disabled={item.status === "LUNAS"}
            type="submit"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-green-200 cursor-pointer"
            title="Konfirmasi Pembayaran"
            onClick={() => handleOpenConfirmPaymentModal(item.id)}
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Biodata Siswa
      </h3>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-10">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 text-sm">
            <div className="flex">
              <span className="text-gray-700 font-medium w-16 flex-shrink-0">
                Nama
              </span>
              <span className="text-gray-600 mx-2">:</span>
              <span className="text-gray-800">{student.name}</span>
            </div>

            <div className="flex">
              <span className="text-gray-700 font-medium w-16 flex-shrink-0">
                NISN
              </span>
              <span className="text-gray-600 mx-2">:</span>
              <span className="text-gray-800">{student.nisn}</span>
            </div>

            <div className="flex">
              <span className="text-gray-700 font-medium w-24 flex-shrink-0">
                Tanggal Lahir
              </span>
              <span className="text-gray-600 mx-2">:</span>
              <span className="text-gray-800">
                {formatDate(new Date(student.birthDate))}
              </span>
            </div>

            <div className="flex">
              <span className="text-gray-700 font-medium w-20 flex-shrink-0">
                Biaya SPP
              </span>
              <span className="text-gray-600 mx-2">:</span>
              <span className="text-gray-800 font-semibold">
                {formatCurrency(student.educationFee.fee)}
              </span>
            </div>

            <div className="flex">
              <span className="text-gray-700 font-medium w-16 flex-shrink-0">
                NIS
              </span>
              <span className="text-gray-600 mx-2">:</span>
              <span className="text-gray-800">{student.nis}</span>
            </div>

            <div className="flex">
              <span className="text-gray-700 font-medium w-16 flex-shrink-0">
                Kelas
              </span>
              <span className="text-gray-600 mx-2">:</span>
              <span className="text-gray-800">Kelas {student.grade}</span>
            </div>

            <div className="flex">
              <span className="text-gray-700 font-medium w-24 flex-shrink-0">
                Tahun Masuk
              </span>
              <span className="text-gray-600 mx-2">:</span>
              <span className="text-gray-800">{student.academicYear.year}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Tagihan SPP{" "}
          {currentAcademicYearFilter && `(${currentAcademicYearFilter})`}
        </h3>
        <div className="flex items-center gap-3">
          <select
            onChange={handleAcademicYearChange}
            defaultValue={currentAcademicYearFilter}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            {academicYears.map((year) => (
              <option key={year.year} value={year.year}>
                {year.year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Tabel columns={columns} data={student.payments} />
      <Alert
        key={`${alertType}-${message}-${Date.now()}`}
        isVisible={
          message !== undefined && message !== "" && alertType !== undefined
        }
        message={message || ""}
        onClose={handleCloseAlert}
        type={alertType || "success"}
        autoClose
      />
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmPaymentModal}
      >
        <ConfirmForm
          nis={student.nis}
          paymentId={selectedPaymentId}
          onClose={handleCloseConfirmPaymentModal}
        />
      </Modal>
    </div>
  );
};
