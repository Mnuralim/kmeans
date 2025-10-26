import { getAllReports } from "@/actions/reports";
import { ReportList } from "./_components/report-list";
import { getAllAcademicYears } from "@/actions/academic-years";
import { getCurrentAcademicYearWithId } from "@/lib/utils";
import { getSession } from "@/actions/session";

interface ReportsPageProps {
  searchParams: Promise<{
    academicYear?: string;
    sortOrder?: string;
    sortBy?: string;
    search?: string;
    grade?: string;
  }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const { academicYear, grade, search, sortBy, sortOrder } = await searchParams;
  const session = await getSession();

  const [{ data }, academicYears, currentYearAcademic] = await Promise.all([
    getAllReports(academicYear, grade, search, sortBy, sortOrder),
    getAllAcademicYears(),
    getCurrentAcademicYearWithId(),
  ]);
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-lg">
      <div className="px-6 py-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Report Management
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola data Laporan disini
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <ReportList
          role={session!.role}
          currentSortOrder={sortOrder}
          data={data}
          academicYears={academicYears}
          selectedAcademicYear={academicYear || currentYearAcademic?.year}
        />
      </div>
    </div>
  );
}
