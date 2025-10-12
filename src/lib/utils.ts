import prisma from "./prisma";

export const formatDate = (
  dateString: string | Date,
  detail: boolean = false
) => {
  const date = new Date(dateString);
  return detail
    ? new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    : new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
        .format(date)
        .split("pukul")[0]
        .trim();
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const generateAcademicYear = (startYear: number): string => {
  const endYear = startYear + 1;
  return `${startYear}/${endYear}`;
};

export const generateAcademicYears = (
  yearsCount: number = 5,
  includeUpcoming: boolean = true
): string[] => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const currentAcademicYearStart =
    currentMonth >= 7 ? currentYear : currentYear - 1;

  const academicYears: string[] = [];

  for (let i = 0; i < yearsCount; i++) {
    const startYear = currentAcademicYearStart - i;
    academicYears.push(generateAcademicYear(startYear));
  }

  if (includeUpcoming && currentMonth < 7) {
    const upcomingYear = currentAcademicYearStart + 1;
    academicYears.unshift(generateAcademicYear(upcomingYear));
  }

  return academicYears;
};

export const getCurrentAcademicYear = (): string => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const currentAcademicYearStart =
    currentMonth >= 7 ? currentYear : currentYear - 1;

  return generateAcademicYear(currentAcademicYearStart);
};

export const generateAcademicYearsWithLabel = (
  yearsCount: number = 5,
  includeUpcoming: boolean = true
): Array<{ value: string; label: string; isCurrent: boolean }> => {
  const academicYears = generateAcademicYears(yearsCount, includeUpcoming);
  const currentAcademicYear = getCurrentAcademicYear();

  return academicYears.map((year) => ({
    value: year,
    label:
      year === currentAcademicYear ? `${year} (Tahun Akademik Saat Ini)` : year,
    isCurrent: year === currentAcademicYear,
  }));
};

export function setToStartOfDay(date: Date): Date {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

export function getNextAcademicYear(currentYear: string): string {
  const [start, end] = currentYear.split("/");
  return `${parseInt(start) + 1}/${parseInt(end) + 1}`;
}

export function determineNextGrade(currentGrade: string): string | null {
  const gradeMap: Record<string, string | null> = {
    "1": "2",
    "2": "3",
    "3": "4",
    "4": "5",
    "5": "6",
    "6": null,
  };
  return gradeMap[currentGrade] || null;
}

export async function getCurrentAcademicYearWithId() {
  return await prisma.academicYear.findFirst({
    where: { isCurrent: true },
    select: { id: true, year: true },
  });
}

export function getCurrentAcademicYearString(): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;
  if (now.getMonth() >= 6) {
    return `${currentYear}/${nextYear}`;
  } else {
    return `${currentYear - 1}/${currentYear}`;
  }
}

export const calculateDaysDifference = (
  paymentDate: string | Date,
  dueDate: string | Date
) => {
  if (!paymentDate || !dueDate) return null;
  const payment = new Date(paymentDate);
  const due = new Date(dueDate);

  const diffInMs = payment.getTime() - due.getTime();
  return Math.round(diffInMs / (1000 * 60 * 60 * 24));
};
