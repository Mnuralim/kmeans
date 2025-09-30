"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAcademicYear(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const year = formData.get("year") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    if (!/^\d{4}\/\d{4}$/.test(year)) {
      return { error: "Format tahun akademik tidak valid. Contoh: 2023/2024" };
    }

    await prisma.academicYear.create({
      data: {
        year,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    revalidatePath("/academic-years");
  } catch (error) {
    console.error(error);
    return { error: "Gagal membuat tahun akademik" };
  }
  redirect("/academic-years?success=1&message=Tahun akademik berhasil dibuat");
}

export async function updateAcademicYear(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const id = formData.get("id") as string;
    const year = formData.get("year") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    if (!/^\d{4}\/\d{4}$/.test(year)) {
      return { error: "Format tahun akademik tidak valid. Contoh: 2023/2024" };
    }

    await prisma.academicYear.update({
      where: { id },
      data: {
        year,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
    revalidatePath("/academic-years");
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengubah tahun akademik" };
  }
  redirect("/academic-years?success=1&message=Tahun akademik berhasil diubah");
}

export async function setCurrentAcademicYear(id: string) {
  try {
    const academicYear = await prisma.academicYear.findUnique({
      where: { id },
      select: { year: true },
    });

    if (!academicYear) {
      throw new Error("Tahun akademik tidak ditemukan");
    }

    const yearFormat = academicYear.year;
    const yearPattern = /^(\d{4})\/(\d{4})$/;
    const match = yearFormat.match(yearPattern);

    if (!match) {
      throw new Error("Format tahun akademik tidak valid. Contoh: 2023/2024");
    }

    const [, startYear, endYear] = match;
    const currentYear = new Date().getFullYear();

    const startYearInt = parseInt(startYear);
    const endYearInt = parseInt(endYear);
    if (currentYear < startYearInt || currentYear > endYearInt) {
      throw new Error(
        `Tahun akademik ${yearFormat} tidak mencakup tahun saat ini (${currentYear})`
      );
    }

    if (parseInt(endYear) !== parseInt(startYear) + 1) {
      throw new Error("Tahun akademik harus berurutan, misalnya 2023/2024");
    }

    await prisma.$transaction([
      prisma.academicYear.updateMany({
        data: { isCurrent: false },
      }),
      prisma.academicYear.update({
        where: { id },
        data: { isCurrent: true },
      }),
    ]);

    revalidatePath("/academic-years");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      redirect(`/academic-years?error=1&message=${error.message}`);
    } else {
      redirect(
        "/academic-years?error=1&message=Terjadi kesalahan saat mengaktifkan tahun akademik"
      );
    }
  }
}

export const getAllAcademicYears = async function () {
  const academicYears = await prisma.academicYear.findMany({
    orderBy: { year: "desc" },
  });
  return academicYears;
};
