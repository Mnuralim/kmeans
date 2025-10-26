// actions/stats.ts
"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getStats = unstable_cache(
  async function getStats() {
    try {
      const currentAcademicYear = await prisma.academicYear.findFirst({
        where: { isCurrent: true },
      });

      const [totalStudents, activeStudents] = await Promise.all([
        prisma.student.count({
          where: {
            isActive: true,
          },
        }),
        prisma.student.count({ where: { isActive: true } }),
      ]);

      const currentDate = new Date();
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const [totalPayments, pendingPayments] = await Promise.all([
        prisma.payment.aggregate({
          where: {
            paymentDate: {
              gte: firstDayOfMonth,
              lte: lastDayOfMonth,
            },
            status: "LUNAS",
          },
          _sum: {
            totalAmount: true,
          },
        }),
        prisma.payment.aggregate({
          where: {
            status: "BELUM_BAYAR",
            dueDate: {
              lte: currentDate,
            },
          },
          _sum: {
            totalAmount: true,
          },
        }),
      ]);

      const lastClustering = await prisma.clusteringHistory.findFirst({
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      });

      const paymentTrends = await getPaymentTrends();

      const gradeDistribution = await prisma.student.groupBy({
        by: ["grade"],
        where: { isActive: true },
        _count: {
          id: true,
        },
        orderBy: {
          grade: "asc",
        },
      });

      const latestClusteringResults = await getLatestClusteringResults();

      return {
        totalStudents,
        activeStudents,
        totalPayments: totalPayments._sum.totalAmount || 0,
        pendingPayments: pendingPayments._sum.totalAmount || 0,
        currentAcademicYear: currentAcademicYear?.year || "Tidak ada",
        lastClusteringDate: lastClustering
          ? new Intl.DateTimeFormat("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(lastClustering.createdAt)
          : null,
        paymentTrends,
        gradeDistribution: gradeDistribution.map((item) => ({
          grade: `Kelas ${item.grade}`,
          students: item._count.id,
        })),
        clusterResults: latestClusteringResults,
      };
    } catch (error) {
      console.error("Error fetching stats:", error);

      return {
        totalStudents: 0,
        activeStudents: 0,
        totalPayments: 0,
        pendingPayments: 0,
        currentAcademicYear: "Tidak ada",
        lastClusteringDate: null,
        paymentTrends: [],
        gradeDistribution: [],
        clusterResults: [],
      };
    }
  },
  ["dashboard-stats"],
  {
    revalidate: 300,
    tags: ["stats"],
  }
);

async function getPaymentTrends() {
  const trends = [];
  const currentDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const firstDay = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      1
    );
    const lastDay = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0
    );

    const [totalPayments, paidPayments] = await Promise.all([
      prisma.payment.count({
        where: {
          createdAt: {
            gte: firstDay,
            lte: lastDay,
          },
        },
      }),
      prisma.payment.count({
        where: {
          createdAt: {
            gte: firstDay,
            lte: lastDay,
          },
          status: "LUNAS",
        },
      }),
    ]);

    const monthName = new Intl.DateTimeFormat("id-ID", {
      month: "short",
    }).format(targetDate);

    const paidPercentage =
      totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0;
    const pendingPercentage = 100 - paidPercentage;

    trends.push({
      month: monthName,
      paid: paidPercentage,
      pending: pendingPercentage,
    });
  }

  return trends;
}

async function getLatestClusteringResults() {
  const latestClustering = await prisma.clusteringHistory.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      clusteringResults: {
        select: {
          clusterLabel: true,
        },
      },
    },
  });

  if (!latestClustering) {
    return [];
  }

  const clusterCounts = latestClustering.clusteringResults.reduce(
    (acc: Record<string, number>, result) => {
      acc[result.clusterLabel] = (acc[result.clusterLabel] || 0) + 1;
      return acc;
    },
    {}
  );

  const totalStudents = latestClustering.clusteringResults.length;

  return Object.entries(clusterCounts).map(([label, count]) => ({
    cluster: label,
    count,
    percentage: Math.round((count / totalStudents) * 100),
  }));
}
