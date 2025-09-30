import { getAllEducationFees } from "@/actions/education-fees";
import { EducationFeeList } from "./_components/education-fee-list";
import { getAllAcademicYears } from "@/actions/academic-years";

interface Props {
  searchParams: Promise<{
    success?: string;
    error?: string;
    message?: string;
  }>;
}

export default async function EducationFeePage({ searchParams }: Props) {
  const { success, message, error } = await searchParams;
  const [educationFees, academicYears] = await Promise.all([
    getAllEducationFees(),
    getAllAcademicYears(),
  ]);
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-lg">
      <div className="px-6 py-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              SPP Management
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola data SPP disini
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <EducationFeeList
          academicYears={academicYears}
          educationFees={educationFees}
          alertType={success ? "success" : error ? "error" : undefined}
          message={message}
        />
      </div>
    </div>
  );
}
