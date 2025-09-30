import { getAllStudents } from "@/actions/students";
import { StudentList } from "./_components/student-list";
import { getAllEducationFees } from "@/actions/education-fees";
import { getAllAcademicYears } from "@/actions/academic-years";

interface Props {
  searchParams: Promise<StudentsPaginationParams>;
}

export default async function StudentPage({ searchParams }: Props) {
  const {
    take,
    skip,
    search,
    grade,
    sortBy,
    sortOrder,
    error,
    success,
    message,
  }: StudentsPaginationParams & {
    error?: string;
    success?: string;
    message?: string;
  } = await searchParams;
  const [studentResult, educationFees, academicYears] = await Promise.all([
    getAllStudents({
      skip: skip || "0",
      sortBy,
      sortOrder,
      take: take || "10",
      grade,
      search,
    }),
    getAllEducationFees(),
    getAllAcademicYears(),
  ]);
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-lg">
      <div className="px-6 py-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Students Management
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola data Siswa disini
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <StudentList
          alertType={success ? "success" : error ? "error" : undefined}
          message={message}
          academicYears={academicYears}
          educationFees={educationFees}
          students={studentResult.students}
          pagination={{
            currentPage: studentResult.currentPage,
            itemsPerPage: studentResult.itemsPerPage,
            totalPages: studentResult.totalPages,
            totalItems: studentResult.totalCount,
            preserveParams: {
              sortBy,
              sortOrder,
              take,
              skip,
              search,
              grade,
            },
          }}
        />
      </div>
    </div>
  );
}
