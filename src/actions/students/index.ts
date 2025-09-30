"use server";

import { revalidatePath, unstable_cache } from "next/cache";
import {
  buildOrderBy,
  buildSearchCondition,
  generatePaymentNumber,
  getAcademicYearMonths,
} from "./helper";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { PaymentStatus, Prisma } from "@prisma/client";
import { determineNextGrade, getCurrentAcademicYearWithId } from "@/lib/utils";

export const getAllStudents = unstable_cache(async function getAllStudents(
  params: StudentsPaginationParams
) {
  const where = buildSearchCondition(params);
  const orderBy = buildOrderBy(params.sortBy, params.sortOrder);

  const [students, totalCount] = await Promise.all([
    prisma.student.findMany({
      where,
      take: Number(params.take),
      skip: Number(params.skip),
      orderBy,
      include: {
        educationFee: true,
        academicYear: true,
      },
    }),
    prisma.student.count({ where }),
  ]);

  return {
    students,
    totalCount,
    currentPage: Math.floor(parseInt(params.skip) / parseInt(params.take)) + 1,
    totalPages: Math.ceil(totalCount / parseInt(params.take)),
    itemsPerPage: parseInt(params.take),
  };
});

export async function createStudent(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const name = formData.get("name") as string;
    const grade = formData.get("grade") as string;
    const nis = formData.get("nis") as string;
    const nisn = formData.get("nisn") as string;
    const birthDate = formData.get("birthDate") as string;
    const educationFeeId = formData.get("educationFeeId") as string;
    const academicYearId = formData.get("academicYearId") as string;

    if (
      !name ||
      !grade ||
      !nis ||
      !nisn ||
      !birthDate ||
      !educationFeeId ||
      !academicYearId
    ) {
      return {
        error: "Semua field harus diisi",
      };
    }

    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [{ nis: nis }, { nisn: nisn }],
        isActive: true,
      },
    });

    if (existingStudent) {
      return {
        error: "NIS/NISN sudah terdaftar",
      };
    }

    const educationFee = await prisma.educationFee.findUnique({
      where: { id: educationFeeId },
    });

    if (!educationFee) {
      return {
        error: "Data SPP tidak ditemukan",
      };
    }

    await prisma.$transaction(async (tx) => {
      const newStudent = await tx.student.create({
        data: {
          name,
          grade,
          nis,
          nisn,
          birthDate: new Date(birthDate),
          academicYearId,
          educationFeeId,
          nextGrade: determineNextGrade(grade),
        },
      });

      const currentAcademicYear = await getCurrentAcademicYearWithId();
      if (!currentAcademicYear) {
        return { error: "Tahun akademik aktif tidak ditemukan" };
      }

      const academicMonths = getAcademicYearMonths(currentAcademicYear.year);
      const paymentSchedule = academicMonths.map((monthData) => {
        const dueDate = new Date(monthData.year, monthData.month - 1, 10);

        const paymentNumber = generatePaymentNumber(
          nis,
          monthData.year,
          monthData.month
        );

        return {
          studentId: newStudent.id,
          paymentNumber,
          totalAmount: educationFee.fee,
          dueDate,
          academicYear: currentAcademicYear.year,
          month: monthData.name,
          year: monthData.year.toString(),
          status: "BELUM_BAYAR" as PaymentStatus,
        };
      });

      await tx.payment.createMany({
        data: paymentSchedule,
      });
    });
  } catch (error) {
    console.error(error);
    return {
      error: "Terjadi kesalahan saat menambahkan data siswa",
    };
  }

  revalidatePath("/students");
  revalidatePath("/");
  revalidatePath("/payments", "layout");
  redirect("/students?success=1&message=Siswa berhasil ditambahkan");
}

export async function deleteStudent(id: string) {
  try {
    await prisma.student.update({
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
      "/students?error=1&message=Terjadi kesalahan saat menghapus siswa"
    );
  }

  revalidatePath("/students");
  revalidatePath("/");
  revalidatePath("/payments", "layout");
  redirect("/students?success=1&message=Siswa berhasil dihapus");
}

export async function updateStudent(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const grade = formData.get("grade") as string;
    const nis = formData.get("nis") as string;
    const nisn = formData.get("nisn") as string;
    const birthDate = formData.get("birthDate") as string;
    const academicYear = formData.get("academicYearId") as string;
    const educationFeeId = formData.get("educationFeeId") as string;

    if (
      !id ||
      !name ||
      !grade ||
      !nis ||
      !nisn ||
      !birthDate ||
      !academicYear ||
      !educationFeeId
    ) {
      return {
        error: "Semua field harus diisi",
      };
    }

    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [{ nis: nis }, { nisn: nisn }],
        isActive: true,
        id: {
          not: id,
        },
      },
    });

    if (existingStudent && existingStudent.id !== id) {
      return {
        error: "NIS/NISN sudah terdaftar",
      };
    }

    const academicYearRecord = await prisma.academicYear.findFirst({
      where: { id: academicYear },
    });

    if (!academicYearRecord) {
      return { error: "Tahun akademik tidak valid" };
    }

    await prisma.student.update({
      where: {
        id,
      },
      data: {
        name,
        grade,
        nis,
        nisn,
        birthDate: new Date(birthDate),
        academicYearId: academicYearRecord.id,
        educationFeeId,
        nextGrade: determineNextGrade(grade),
      },
    });
  } catch (error) {
    console.error(error);
    return {
      error: "Terjadi kesalahan saat memperbarui data siswa",
    };
  }

  revalidatePath("/students");
  revalidatePath("/");
  revalidatePath("/payments", "layout");
  redirect("/students?success=1&message=Siswa berhasil diperbarui");
}

export const getStudentByNIS = unstable_cache(async function getStudentByNIS(
  nis: string,
  academicYear?: string
) {
  if (!nis) return null;

  const whereCondition: Prisma.PaymentWhereInput[] = [];
  if (!academicYear) {
    const currentAcademicYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
    });
    if (currentAcademicYear) {
      whereCondition.push({
        academicYear: currentAcademicYear.year,
      });
    }
  } else if (academicYear !== "all") {
    whereCondition.push({
      academicYear,
    });
  }

  return await prisma.student.findFirst({
    where: {
      nis,
      isActive: true,
    },
    include: {
      payments: {
        where: {
          isActive: true,
          ...(whereCondition.length > 0 ? { AND: whereCondition } : {}),
        },
        orderBy: {
          dueDate: "asc",
        },
      },
      educationFee: true,
      academicYear: true,
    },
  });
});

export const customRevalidation = async () => {
  revalidatePath("/", "layout");
};
