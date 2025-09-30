"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

export const getAllEducationFees = unstable_cache(
  async function getAllEducationFees() {
    return await prisma.educationFee.findMany({
      where: {
        isActive: true,
      },
      include: {
        academicYear: true,
      },
      orderBy: {
        academicYear: {
          year: "desc",
        },
      },
    });
  }
);

export async function createEducationFee(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const academicYear = formData.get("academicYear") as string;
    const fee = formData.get("educationFee") as string;

    if (!academicYear || !fee) {
      return {
        error: "Semua field harus diisi",
      };
    }

    const existingAcademicYear = await prisma.educationFee.findFirst({
      where: {
        academicYearId: academicYear,
        isActive: true,
      },
    });

    if (existingAcademicYear) {
      return {
        error: "SPP dengan tahun akademik tersebut sudah ada",
      };
    }

    await prisma.educationFee.create({
      data: {
        academicYearId: academicYear,
        fee: parseFloat(fee),
      },
    });
  } catch (error) {
    console.error(error);
    return {
      error: "Terjadi kesalahan saat membuat SPP",
    };
  }

  revalidatePath("/education-fees");
  revalidatePath("/students");
  redirect("/education-fees?success=1&message=SPP berhasil dibuat");
}

export async function updateEducationFee(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const id = formData.get("id") as string;
    const academicYear = formData.get("academicYear") as string;
    const fee = formData.get("educationFee") as string;

    if (!id || !academicYear || !fee) {
      return {
        error: "Semua field harus diisi",
      };
    }

    const isValidAcademicYear = /^\d{4}\/\d{4}$/.test(academicYear);
    if (!isValidAcademicYear) {
      return {
        error: "Format tahun akademik tidak valid",
      };
    }

    const existingAcademicYear = await prisma.educationFee.findFirst({
      where: {
        academicYearId: academicYear,
        isActive: true,
      },
    });

    if (existingAcademicYear && existingAcademicYear.id !== id) {
      return {
        error: "SPP dengan tahun akademik tersebut sudah ada",
      };
    }

    await prisma.educationFee.update({
      where: {
        id,
      },
      data: {
        academicYearId: academicYear,
        fee: parseFloat(fee),
      },
    });
  } catch (error) {
    console.error(error);
    return {
      error: "Terjadi kesalahan saat memperbarui SPP",
    };
  }

  revalidatePath("/education-fees");
  revalidatePath("/students");
  redirect("/education-fees?success=1&message=SPP berhasil diperbarui");
}

export async function deleteEducationFee(id: string) {
  try {
    await prisma.educationFee.update({
      where: {
        id,
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    console.error(error);
    redirect(
      "/education-fees?error=1&message=Terjadi kesalahan saat menghapus SPP"
    );
  }

  revalidatePath("/education-fees");
  revalidatePath("/students");
  redirect("/education-fees?success=1&message=SPP berhasil dihapus");
}
