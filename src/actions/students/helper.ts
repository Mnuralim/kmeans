import type { Prisma } from "@prisma/client";

export function buildSearchCondition(
  params: StudentsPaginationParams
): Prisma.StudentWhereInput {
  const andConditions: Prisma.StudentWhereInput[] = [];

  if (params.grade) {
    andConditions.push({
      grade: params.grade,
    });
  }

  if (params.search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: params.search,
          },
        },
        {
          nis: {
            contains: params.search,
          },
        },
        {
          nisn: {
            contains: params.search,
          },
        },
      ],
    });
  }

  return {
    isActive: true,
    ...(andConditions.length > 0 ? { AND: andConditions } : {}),
  };
}

export function buildOrderBy(
  sortBy?: string,
  sortOrder?: string
): Prisma.StudentOrderByWithRelationInput {
  const order = (sortOrder as Prisma.SortOrder) || "desc";

  if (sortBy === "name") {
    return {
      name: order,
    };
  }

  if (sortBy === "grade") {
    return {
      grade: order,
    };
  }

  return {
    createdAt: order,
  };
}

export function generatePaymentNumber(
  nis: string,
  year: number,
  month: number
): string {
  const timestamp = Date.now().toString().slice(-4);
  return `SPP-${nis}-${year}-${month.toString().padStart(2, "0")}-${timestamp}`;
}

export function getAcademicYearMonths(academicYear: string) {
  const [startYear, endYear] = academicYear.split("/").map((y) => parseInt(y));

  return [
    { name: "Juli", month: 7, year: startYear },
    { name: "Agustus", month: 8, year: startYear },
    { name: "September", month: 9, year: startYear },
    { name: "Oktober", month: 10, year: startYear },
    { name: "November", month: 11, year: startYear },
    { name: "Desember", month: 12, year: startYear },
    { name: "Januari", month: 1, year: endYear },
    { name: "Februari", month: 2, year: endYear },
    { name: "Maret", month: 3, year: endYear },
    { name: "April", month: 4, year: endYear },
    { name: "Mei", month: 5, year: endYear },
    { name: "Juni", month: 6, year: endYear },
  ];
}
