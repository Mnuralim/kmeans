"use server";
import { KMeans, type Cluster } from "@/lib/kmeans2";
import prisma from "@/lib/prisma";
import csv from "csv-parser";
import { Readable } from "stream";

interface FormState {
  success?: boolean;
  message?: string;
  data?: Cluster[];
  error?: unknown;
  clusteringHistoryId?: string;
}

interface ProcessedRow {
  "Nama Siswa": string;
  NIS: string;
  Kelas: number;
  SPP: number;
  [monthKey: string]: string | number;
}

interface CsvRow {
  "Nama Siswa": string;
  NIS: string;
  Kelas: string;
  SPP: string;
  [key: string]: string;
}

interface CsvProcessResult {
  success: boolean;
  data?: ProcessedRow[];
  message?: string;
}

export interface ClusteringHistory {
  id: string;
  name: string;
  description?: string;
  fileName: string;
  totalStudents: number;
  maxIterations: number;
  actualIterations: number;
  isConverged: boolean;
  status: string;
  createdAt: Date;
  clusters: ClusterData[];
  monthKeys: string[];
}

interface ClusterData {
  id: string;
  clusterIndex: number;
  label: string;
  centroids: number[];
  monthKeys: string[];
  totalPoints: number;
  clusteringResults: ClusteringResultDetail[];
}
interface ClusteringResultDetail {
  id: string;
  studentName: string;
  nis: string;
  grade: number;
  spp: number;
  monthlyPayments: Record<string, number>;
  centroids: number[];
  monthKeys: string[];
  clusterLabel: string;
  clusterIndex: number;
}

async function processCsvFile(
  csvString: string,
  month1: string,
  month2: string,
  month3: string
): Promise<CsvProcessResult> {
  return new Promise((resolve) => {
    const rawCsvData: ProcessedRow[] = [];
    let csvHeaders: string[] = [];
    let hasHeaderValidated = false;

    Readable.from(csvString)
      .pipe(csv())
      .on("headers", (headers: string[]) => {
        csvHeaders = headers;

        const missingMonths = [month1, month2, month3].filter(
          (month) => !csvHeaders.includes(month)
        );

        if (missingMonths.length > 0) {
          resolve({
            success: false,
            message: `Bulan berikut tidak ditemukan dalam file CSV: ${missingMonths.join(
              ", "
            )}. Kolom yang tersedia: ${csvHeaders.join(", ")}`,
          });
          return;
        }

        hasHeaderValidated = true;
      })
      .on("data", (row: CsvRow) => {
        if (!hasHeaderValidated) return;

        const processedRow = {
          "Nama Siswa": row["Nama Siswa"]?.trim() || "",
          NIS: row.NIS?.trim() || "",
          Kelas: parseInt(row.Kelas) || 0,
          SPP: parseInt(row.SPP) || 0,
          [month1]: parseInt(row[month1]) || 0,
          [month2]: parseInt(row[month2]) || 0,
          [month3]: parseInt(row[month3]) || 0,
        };

        for (const month of [month1, month2, month3]) {
          if (isNaN(processedRow[month] as number)) {
            resolve({
              success: false,
              message: `Nilai bulan ${month} harus berupa angka`,
            });
            return;
          }
        }

        rawCsvData.push(processedRow);
      })
      .on("end", () => {
        if (hasHeaderValidated) {
          resolve({
            success: true,
            data: rawCsvData,
          });
        }
      })
      .on("error", () => {
        resolve({
          success: false,
          message: "Error parsing CSV file",
        });
      });
  });
}

export async function submitClustering(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  let clusteringHistoryId: string | null = null;

  try {
    const file = formData.get("file") as File;
    const maxIterations = formData.get("max_iterations") as string;
    const clusteringName =
      (formData.get("clustering_name") as string) || "test";
    const description = (formData.get("description") as string) || "test desc";
    const month1 = formData.get("month1") as string;
    const month2 = formData.get("month2") as string;
    const month3 = formData.get("month3") as string;

    if (!file) {
      return { success: false, message: "File not found in form data" };
    }

    if (!clusteringName) {
      return { success: false, message: "Nama clustering harus diisi" };
    }

    if (!month1 || !month2 || !month3) {
      return {
        success: false,
        message: "Harus memilih 3 bulan untuk clustering",
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const csvString = buffer.toString("utf-8");

    const csvResult = await processCsvFile(csvString, month1, month2, month3);

    if (!csvResult.success) {
      return {
        success: false,
        message: csvResult.message || "Error processing CSV",
      };
    }

    const rawCsvData = csvResult.data!;

    const clusteringHistory = await prisma.clusteringHistory.create({
      data: {
        name: clusteringName,
        description: description || null,
        fileName: file.name,
        totalStudents: rawCsvData.length,
        maxIterations: maxIterations ? parseInt(maxIterations) : 100,
        actualIterations: 0,
        isConverged: false,
        status: "PROCESSING",
        clusteringData: {},
      },
    });

    clusteringHistoryId = clusteringHistory.id;

    const processKmeans = new KMeans(
      rawCsvData,
      3,
      [month1, month2, month3],
      maxIterations ? parseInt(maxIterations) : 100
    );
    const clusters = processKmeans.run();

    await prisma.clusteringHistory.update({
      where: { id: clusteringHistoryId },
      data: {
        actualIterations: processKmeans.getActualIterations(),
        isConverged: processKmeans.isConverged(),
        status: "COMPLETED",
        clusteringData: JSON.parse(
          JSON.stringify({
            clusters: clusters.map((cluster) => ({
              centroid: cluster.centroid,
              points: cluster.points,
              label: cluster.label,
            })),
            originalData: rawCsvData,
            metadata: {
              totalDataPoints: rawCsvData.length,
              numberOfClusters: clusters.length,
              processedAt: new Date().toISOString(),
              monthKeys: processKmeans.getMonthKeys(),
            },
          })
        ),
      },
    });

    await saveClusteringResults(clusteringHistoryId, clusters, [
      month1,
      month2,
      month3,
    ]);

    return {
      success: true,
      message: "Clustering berhasil diproses dan disimpan",
      data: clusters,
      clusteringHistoryId: clusteringHistoryId,
    };
  } catch (error) {
    console.error("Error in submitClustering:", error);

    if (clusteringHistoryId) {
      await prisma.clusteringHistory
        .update({
          where: { id: clusteringHistoryId },
          data: { status: "FAILED" },
        })
        .catch(console.error);
    }

    return {
      success: false,
      message: "An error occurred while processing the clustering",
      error,
    };
  }
}
async function saveClusteringResults(
  clusteringHistoryId: string,
  clusters: Cluster[],
  monthKeys: string[]
) {
  try {
    await prisma.clusteringResult.deleteMany({
      where: { clusteringHistoryId },
    });

    for (let clusterIndex = 0; clusterIndex < clusters.length; clusterIndex++) {
      const cluster = clusters[clusterIndex];

      for (const point of cluster.points) {
        const existingStudent = await prisma.student.findFirst({
          where: { nis: point.NIS },
        });

        const monthlyPayments: Record<string, number> = {};
        monthKeys.forEach((month) => {
          monthlyPayments[month.toLowerCase()] = point[month] as number;
        });

        const centroids = cluster.centroid;

        await prisma.clusteringResult.create({
          data: {
            clusteringHistoryId,
            studentId: existingStudent?.id || null,
            studentName: point["Nama Siswa"],
            nis: point.NIS,
            grade: point.Kelas,
            spp: point.SPP,
            monthlyPayments: monthlyPayments,
            centroids: centroids,
            clusterIndex: clusterIndex,
            clusterLabel: cluster.label,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error saving clustering results:", error);
    throw error;
  }
}

export async function getClusteringHistory() {
  try {
    const histories = await prisma.clusteringHistory.findMany({
      orderBy: { createdAt: "desc" },
    });

    return histories;
  } catch (error) {
    console.error("Error fetching clustering history:", error);
    throw error;
  }
}

export async function getClusteringDetails(
  clusteringHistoryId: string
): Promise<ClusteringHistory | null> {
  try {
    const clusteringHistory = await prisma.clusteringHistory.findUnique({
      where: { id: clusteringHistoryId },
      include: {
        clusteringResults: {
          orderBy: [{ clusterIndex: "asc" }, { studentName: "asc" }],
        },
      },
    });

    if (!clusteringHistory) {
      return null;
    }

    const clusteringData = clusteringHistory.clusteringData as {
      metadata?: { monthKeys?: string[] };
    };
    const monthKeys = clusteringData?.metadata?.monthKeys || [
      "Januari",
      "Februari",
      "Maret",
    ];

    const clustersMap = new Map<number, ClusterData>();

    clusteringHistory.clusteringResults.forEach((result) => {
      const clusterIndex = result.clusterIndex;

      if (!clustersMap.has(clusterIndex)) {
        clustersMap.set(clusterIndex, {
          id: `cluster-${clusterIndex}`,
          clusterIndex,
          label: result.clusterLabel,
          centroids: result.centroids as number[], // JSON field
          monthKeys: monthKeys,
          totalPoints: 0,
          clusteringResults: [],
        });
      }

      const cluster = clustersMap.get(clusterIndex)!;

      cluster.clusteringResults.push({
        id: result.id,
        studentName: result.studentName,
        nis: result.nis,
        grade: result.grade,
        spp: result.spp,
        monthlyPayments: result.monthlyPayments as Record<string, number>, // JSON field
        centroids: result.centroids as number[], // JSON field
        monthKeys: monthKeys,
        clusterLabel: result.clusterLabel,
        clusterIndex: result.clusterIndex,
      });

      cluster.totalPoints++;
    });

    const clusters = Array.from(clustersMap.values()).sort(
      (a, b) => a.clusterIndex - b.clusterIndex
    );

    return {
      id: clusteringHistory.id,
      name: clusteringHistory.name,
      description: clusteringHistory.description || undefined,
      fileName: clusteringHistory.fileName,
      totalStudents: clusteringHistory.totalStudents,
      maxIterations: clusteringHistory.maxIterations,
      actualIterations: clusteringHistory.actualIterations,
      isConverged: clusteringHistory.isConverged,
      status: clusteringHistory.status,
      createdAt: clusteringHistory.createdAt,
      clusters,
      monthKeys,
    };
  } catch (error) {
    console.error("Error fetching clustering details:", error);
    throw error;
  }
}
export async function deleteClusteringHistory(clusteringHistoryId: string) {
  try {
    await prisma.clusteringHistory.delete({
      where: { id: clusteringHistoryId },
    });

    return {
      success: true,
      message: "Riwayat clustering berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting clustering history:", error);
    return {
      success: false,
      message: "Gagal menghapus riwayat clustering",
      error,
    };
  }
}
