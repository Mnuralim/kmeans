"use client";
import type { PaymentData } from "@/actions/reports";
import { calculateDaysDifference, formatDate } from "@/lib/utils";
import React, { useState } from "react";
import type { AcademicYear } from "@prisma/client";
import { ReportFilterControl } from "./filter-controll";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { Modal } from "@/app/_components/modal";

interface Props {
  data: PaymentData[];
  academicYears: AcademicYear[];
  selectedAcademicYear?: string;
  currentSortOrder?: string;
}

const months = [
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
];

export const ReportList = ({
  data,
  academicYears,
  selectedAcademicYear,
  currentSortOrder,
}: Props) => {
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(11);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const getStatusBadge = (payment: {
    paymentDate: string | null;
    dueDate?: string | null;
    status: "LUNAS" | "BELUM_BAYAR";
  }) => {
    if (!payment || payment.status === "BELUM_BAYAR") {
      return (
        <div className="flex items-center gap-1 text-amber-600">
          <Clock className="w-3 h-3" />
          <span className="text-xs">Belum</span>
        </div>
      );
    }
    if (payment.status === "LUNAS" && payment.paymentDate && payment.dueDate) {
      const daysDiff = calculateDaysDifference(
        payment.paymentDate,
        payment.dueDate
      );
      if ((daysDiff as number) > 0) {
        return (
          <div className="flex items-center gap-1 text-red-600">
            <XCircle className="w-3 h-3" />
            <span className="text-xs">+{daysDiff}h</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="w-3 h-3" />
          <span className="text-xs">Lunas</span>
        </div>
      );
    }
  };

  const isValidMonthOrder = () => {
    if (
      (startMonth <= 5 && endMonth <= 5) ||
      (startMonth >= 6 && endMonth >= 6)
    ) {
      return startMonth <= endMonth;
    }
    if (startMonth <= 5 && endMonth >= 6) {
      return true;
    }

    return false;
  };

  const getSelectedMonths = () => {
    if (startMonth <= endMonth) {
      return months.slice(startMonth, endMonth + 1);
    } else {
      return [...months.slice(startMonth), ...months.slice(0, endMonth + 1)];
    }
  };

  const exportToCSV = () => {
    const selectedMonths = getSelectedMonths();

    const infoHeaders = [
      `Laporan Pembayaran SPP`,
      `Tahun Ajaran: ${selectedAcademicYear}`,
      `Periode: ${months[startMonth]} - ${months[endMonth]}`,
      `Tanggal Export: ${new Date().toLocaleDateString("id-ID")}`,
      "",
    ];

    const headers = [
      "No",
      "Nama Siswa",
      "NIS",
      "Kelas",
      "SPP",
      ...selectedMonths,
    ];

    const csvData = data.map((student, index) => {
      const row = [
        index + 1,
        student.studentName,
        student.nis,
        student.grade,
        student.educationFee || "N/A",
      ];

      selectedMonths.forEach((month) => {
        const payment = student.payments[month];
        if (
          payment?.status === "LUNAS" &&
          payment.paymentDate &&
          payment.dueDate
        ) {
          const daysDiff = calculateDaysDifference(
            payment.paymentDate,
            payment.dueDate
          );
          row.push(daysDiff !== null ? daysDiff.toString() : "");
        } else {
          row.push("");
        }
      });

      return row;
    });

    const allRows = [...infoHeaders.map((info) => [info]), headers, ...csvData];

    const csvContent = allRows
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    const startMonthName = months[startMonth];
    const endMonthName = months[endMonth];
    const academicYearSuffix = selectedAcademicYear
      ? `-${selectedAcademicYear}`
      : "";

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `laporan-pembayaran-${startMonthName}-${endMonthName}${academicYearSuffix}-${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportOptions(false);
  };

  const handleExport = () => {
    setShowExportOptions(true);
  };

  const handleCancel = () => {
    setShowExportOptions(false);
  };

  const getValidationMessage = () => {
    if (!isValidMonthOrder()) {
      return "Pilih bulan secara berurutan sesuai periode akademik (Juli-Juni)";
    }
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <ReportFilterControl
        currentSortOrder={currentSortOrder}
        academicYears={academicYears}
        currentAcademicYear={selectedAcademicYear}
      />
      <div className="my-5 items-center justify-between flex gap-3">
        <h1 className="text-xl font-bold">
          Laporan Periode {selectedAcademicYear}
        </h1>
        <button
          onClick={handleExport}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Export Detail CSV
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 w-16">
                  No
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 min-w-[200px]">
                  Nama Siswa
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 w-24">
                  Kelas
                </th>
                {months.map((month) => (
                  <th
                    key={month}
                    className="text-center py-4 px-3 text-sm font-semibold text-gray-900 min-w-[80px]"
                  >
                    <div className="space-y-1">
                      <div>{month}</div>
                      <div className="text-xs text-gray-500 font-normal">
                        Tgl / Status
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((student, index) => (
                <tr
                  key={student.studentId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">
                      {student.studentName}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {student.grade}
                  </td>
                  {months.map((month) => {
                    const payment = student.payments[month];
                    return (
                      <td key={month} className="py-4 px-3 text-center">
                        <div className="space-y-1">
                          <div className="text-xs text-gray-600">
                            {payment.paymentDate
                              ? formatDate(payment.paymentDate)
                              : "-"}
                          </div>
                          <div className="flex justify-center">
                            {getStatusBadge(payment)}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showExportOptions} onClose={handleCancel}>
        <div className="bg-white rounded-lg p-6 ">
          <h3 className="text-lg font-semibold mb-4">
            Pilih Rentang Bulan Export
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bulan Awal:
              </label>
              <select
                value={startMonth}
                onChange={(e) => setStartMonth(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bulan Akhir:
              </label>
              <select
                value={endMonth}
                onChange={(e) => setEndMonth(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Pesan validasi */}
            {getValidationMessage() && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{getValidationMessage()}</p>
              </div>
            )}

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Bulan yang akan diexport:</strong>
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {isValidMonthOrder()
                  ? getSelectedMonths().join(", ")
                  : "Pilihan tidak valid"}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Tahun Ajaran:</strong>{" "}
                <span className="text-blue-600">{selectedAcademicYear}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={exportToCSV}
              disabled={!isValidMonthOrder()}
              className={`flex-1 font-bold py-2 px-4 rounded transition-colors ${
                isValidMonthOrder()
                  ? "bg-blue-500 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Export CSV
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Batal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
