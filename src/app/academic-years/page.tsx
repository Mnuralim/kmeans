import { AcademicYearsList } from "./_components/list";
import { getAllAcademicYears } from "@/actions/academic-years";

interface Props {
  searchParams: Promise<{
    success?: string;
    error?: string;
    message?: string;
  }>;
}

export default async function AcademicYearPage({ searchParams }: Props) {
  const { success, message, error } = await searchParams;
  const academicYears = await getAllAcademicYears();

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-lg">
      <div className="px-6 py-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Academic Year Management
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola data Tahun Ajaran disini
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <AcademicYearsList
          academicYears={academicYears}
          alertType={success ? "success" : error ? "error" : undefined}
          message={message}
        />
      </div>
    </div>
  );
}
