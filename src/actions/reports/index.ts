"use server";

import prisma from "@/lib/prisma";
import { getCurrentAcademicYearWithId } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

interface ClusteringDataset {
  studentId: string;
  studentName: string;
  grade: string;
  paidMonths: number;
  latePayments: number;
}
export type PaymentData = ClusteringDataset & {
  nis: string;
  nisn: string;
  educationFee: number;
  payments: {
    [month: string]: {
      paymentDate: string | null;
      dueDate?: string | null;
      status: "LUNAS" | "BELUM_BAYAR";
    };
  };
};

export async function getAllReports(
  academicYear?: string,
  grade?: string,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) {
  const currentAcademicYear = await getCurrentAcademicYearWithId();
  const studentWhere: Prisma.StudentWhereInput = {
    isActive: true,
    payments: {
      some: {
        academicYear: currentAcademicYear?.year,
      },
    },
  };

  if (academicYear) {
    studentWhere.payments = {
      some: {
        academicYear,
      },
    };
  }

  if (grade) {
    studentWhere.grade = grade;
  }

  if (search) {
    studentWhere.OR = [
      {
        name: {
          contains: search,
        },
      },
      {
        nis: {
          contains: search,
        },
      },
      {
        nisn: {
          contains: search,
        },
      },
    ];
  }

  const students = await prisma.student.findMany({
    where: studentWhere,
    include: {
      educationFee: true,
      academicYear: true,
      payments: {
        where: {
          isActive: true,
        },
        orderBy: {
          paymentDate: "asc",
        },
      },
    },
    orderBy: {
      [sortBy || "name"]: sortOrder || "asc",
    },
  });

  const months = [
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
  ];

  const getAcademicMonthName = (monthIndex: number): string => {
    const monthMapping = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return monthMapping[monthIndex];
  };

  const dataset: PaymentData[] = students.map((student) => {
    const payments = student.payments;
    const paymentsMap: PaymentData["payments"] = {};

    months.forEach((month) => {
      paymentsMap[month] = {
        paymentDate: null,
        dueDate: null,
        status: "BELUM_BAYAR",
      };
    });

    payments.forEach((payment) => {
      const monthIndex = payment.paymentDate?.getMonth();
      const monthName = getAcademicMonthName(monthIndex ?? 0);

      paymentsMap[monthName] = {
        paymentDate: payment.paymentDate
          ? payment.paymentDate.toLocaleString()
          : null,
        dueDate: payment.dueDate ? payment.dueDate.toLocaleString() : null,
        status: payment.status,
      };
    });

    const paidPayments = payments.filter((p) => p.status === "LUNAS");
    const paidMonths = paidPayments.length;

    const totalLateDays = paidPayments.reduce((total, payment) => {
      if (
        payment.dueDate &&
        payment.paymentDate &&
        payment.status === "LUNAS"
      ) {
        const dueDate = new Date(payment.dueDate);
        const paymentDate = new Date(payment.paymentDate);

        if (paymentDate.getTime() > dueDate.getTime()) {
          const lateDays = Math.floor(
            (paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          total += lateDays;
        }
      }
      return total;
    }, 0);

    return {
      studentId: student.id,
      nis: student.nis,
      nisn: student.nisn,
      educationFee: student.educationFee.fee,
      studentName: student.name,
      grade: student.grade,
      paidMonths,
      latePayments: totalLateDays,
      payments: paymentsMap,
      academicYear: student.academicYear.year,
    };
  });

  return {
    data: dataset,
    total: dataset.length,
  };
}
