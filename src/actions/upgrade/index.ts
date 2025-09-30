"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { determineNextGrade, getNextAcademicYear } from "@/lib/utils";
import {
  generatePaymentNumber,
  getAcademicYearMonths,
} from "../students/helper";
import { redirect } from "next/navigation";

export async function prepareClassUpgrade() {
  try {
    const currentAcademicYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
    });

    if (!currentAcademicYear) {
      throw new Error("Tahun akademik aktif tidak ditemukan");
    }

    const students = await prisma.student.findMany({
      where: {
        isActive: true,
      },
    });

    const updatePromises = students.map((student) => {
      const nextGrade = determineNextGrade(student.grade);
      return prisma.student.update({
        where: { id: student.id },
        data: { nextGrade },
      });
    });

    await Promise.all(updatePromises);

    revalidatePath("/upgrades");
  } catch (error) {
    console.error("Error preparing class upgrade:", error);
    if (error instanceof Error) {
      redirect(`/upgrades?error=1&message=${error.message}`);
    } else {
      redirect(
        `/upgrades?error=1&message=Terjadi kesalahan saat persiapan upgrade kelas`
      );
    }
  }

  redirect("/upgrades?success=1&message=Persiapan upgrade kelas berhasil");
}

export async function executeClassUpgrade() {
  try {
    const currentAcademicYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
    });

    if (!currentAcademicYear) {
      throw new Error("Tahun akademik aktif tidak ditemukan");
    }

    const yearPattern = /^(\d{4})\/(\d{4})$/;
    const match = currentAcademicYear.year.match(yearPattern);

    if (!match) {
      throw new Error(
        "Format tahun akademik aktif tidak valid. Gunakan format YYYY/YYYY"
      );
    }

    const [, startYear, endYear] = match;
    const currentYear = new Date().getFullYear();

    const startYearInt = parseInt(startYear);
    const endYearInt = parseInt(endYear);

    if (currentYear < startYearInt || currentYear > endYearInt) {
      throw new Error(
        `Tahun akademik ${currentAcademicYear.year} tidak mencakup tahun saat ini (${currentYear}). Tidak dapat melakukan upgrade kelas.`
      );
    }

    if (endYearInt !== startYearInt + 1) {
      throw new Error(
        "Format tahun akademik tidak valid. Tahun kedua harus satu tahun setelah tahun pertama"
      );
    }

    const nextAcademicYearStr = getNextAcademicYear(currentAcademicYear.year);
    const nextAcademicYear = await prisma.academicYear.findFirst({
      where: { year: nextAcademicYearStr },
    });

    if (!nextAcademicYear) {
      throw new Error(
        "Tahun akademik berikutnya tidak ditemukan, pastikan tahun akademik berikutnya sudah dibuat"
      );
    }

    const nextMatch = nextAcademicYear.year.match(yearPattern);
    if (!nextMatch) {
      throw new Error(
        "Format tahun akademik berikutnya tidak valid. Gunakan format YYYY/YYYY"
      );
    }

    const [, nextStartYear, nextEndYear] = nextMatch;
    const nextStartYearInt = parseInt(nextStartYear);
    const nextEndYearInt = parseInt(nextEndYear);

    if (nextStartYearInt !== endYearInt) {
      throw new Error(
        `Tahun akademik berikutnya (${nextAcademicYear.year}) tidak konsisten dengan tahun akademik saat ini (${currentAcademicYear.year})`
      );
    }

    if (nextEndYearInt !== nextStartYearInt + 1) {
      throw new Error(
        "Format tahun akademik berikutnya tidak valid. Tahun kedua harus satu tahun setelah tahun pertama"
      );
    }

    const studentsToUpgrade = await prisma.student.findMany({
      where: {
        isActive: true,
        nextGrade: { not: null },
      },
      include: {
        academicYear: true,
      },
    });

    const upgradePromises = studentsToUpgrade.map((student) => {
      return prisma.$transaction([
        prisma.student.update({
          where: { id: student.id },
          data: {
            grade: student.grade === "6" ? "lulus" : student.nextGrade!,
            nextGrade: null,
          },
        }),
      ]);
    });

    await Promise.all(upgradePromises);

    await prisma.academicYear.updateMany({
      where: { id: currentAcademicYear.id },
      data: { isCurrent: false },
    });

    await prisma.academicYear.update({
      where: { id: nextAcademicYear.id },
      data: { isCurrent: true },
    });

    await createNewPaymentSchedules(nextAcademicYear.id);

    revalidatePath("/upgrades");
    revalidatePath("/students");
  } catch (error) {
    console.error("Error executing class upgrade:", error);
    if (error instanceof Error) {
      redirect(`/upgrades?error=1&message=${error.message}`);
    } else {
      redirect(
        `/upgrades?error=1&message=Terjadi kesalahan saat melakukan upgrade kelas`
      );
    }
  }

  redirect("/upgrades?success=1&message=Upgrade kelas berhasil dilakukan");
}

async function createNewPaymentSchedules(academicYearId: string) {
  const academicYear = await prisma.academicYear.findUnique({
    where: { id: academicYearId },
    include: {
      students: {
        where: { isActive: true },
        include: { educationFee: true },
      },
    },
  });

  if (!academicYear) return;

  const students = await prisma.student.findMany({
    where: {
      isActive: true,
    },
    include: {
      educationFee: true,
    },
  });

  const paymentPromises = students.map((student) => {
    const academicMonths = getAcademicYearMonths(academicYear.year);
    const paymentSchedules = academicMonths.map((monthData) => {
      const dueDate = new Date(monthData.year, monthData.month - 1, 10);
      return {
        studentId: student.id,
        paymentNumber: generatePaymentNumber(
          student.nis,
          monthData.year,
          monthData.month
        ),
        totalAmount: student.educationFee.fee,
        dueDate,
        academicYear: academicYear.year,
        month: monthData.name,
        year: monthData.year.toString(),
        status: "BELUM_BAYAR" as const,
      };
    });
    console.log("paymentSchedules ", paymentSchedules);
    return prisma.payment.createMany({ data: paymentSchedules });
  });

  console.log("paymentPromises ", paymentPromises);

  await Promise.all(paymentPromises);
}

export async function upgradeStats() {
  const currentYear = await prisma.academicYear.findFirst({
    where: { isCurrent: true },
  });

  const stats = {
    currentYear,
    totalStudents: currentYear
      ? await prisma.student.count({
          where: { isActive: true },
        })
      : 0,
    preparedStudents: currentYear
      ? await prisma.student.count({
          where: {
            isActive: true,
            nextGrade: { not: null },
          },
        })
      : 0,
    nextYear: currentYear ? getNextAcademicYear(currentYear.year) : null,
  };

  return stats;
}
