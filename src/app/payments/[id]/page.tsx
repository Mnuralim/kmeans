import { PaymentDetail } from "./_components/payment-detail";
import { FileX } from "lucide-react";
import { getStudentByNIS } from "@/actions/students";
import { getCurrentAcademicYearWithId } from "@/lib/utils";
import { getAllAcademicYears } from "@/actions/academic-years";

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    message?: string;
    success?: string;
    academicYear?: string;
  }>;
}

export default async function DetailPaymentsPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { error, message, success, academicYear } = await searchParams;
  const [student, academicYears, currentAcademic] = await Promise.all([
    getStudentByNIS(id, academicYear),
    getAllAcademicYears(),
    getCurrentAcademicYearWithId(),
  ]);
  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center border border-gray-100 bg-white rounded-lg shadow-sm p-8">
        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
          <FileX className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-lg font-medium text-slate-900 mb-2 text-center">
          Tidak ada data yang tersedia
        </p>
        <p className="text-sm text-slate-500 text-center">
          Coba ubah filter pencarian Anda
        </p>
      </div>
    );
  }
  return (
    <div>
      <PaymentDetail
        student={student}
        alertType={success ? "success" : error ? "error" : undefined}
        message={message}
        currentAcademicYearFilter={academicYear || currentAcademic?.year}
        academicYears={academicYears}
      />
    </div>
  );
}
