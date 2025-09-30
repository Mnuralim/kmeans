"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Calendar,
  Users,
  Target,
  TrendingUp,
  FileText,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import type { ClusteringHistory } from "@/actions/clustering";

interface Props {
  clusteringDetails: ClusteringHistory;
}

export const ClusteringResults = ({ clusteringDetails }: Props) => {
  const [activeTab, setActiveTab] = useState<"overview" | "charts" | "details">(
    "overview"
  );
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const getClusterColor = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("tepat waktu")) {
      return "#10B981";
    } else if (lowerLabel.includes("terlambat ringan")) {
      return "#F59E0B";
    } else if (lowerLabel.includes("terlambat berat")) {
      return "#EF4444";
    }
    return "#6B7280";
  };

  const clusterColors = clusteringDetails.clusters.map((cluster) =>
    getClusterColor(cluster.label)
  );

  const monthKeys = clusteringDetails.monthKeys || [
    "Januari",
    "Februari",
    "Maret",
  ];

  const clusterDistribution = clusteringDetails.clusters.map(
    (cluster, index) => ({
      name: cluster.label,
      value: cluster.totalPoints,
      color: clusterColors[index % clusterColors.length],
    })
  );

  const centroidData = clusteringDetails.clusters.map((cluster, index) => {
    const centroidObj: Record<string, number | string> = {
      cluster: cluster.label,
      color: clusterColors[index % clusterColors.length],
    };

    monthKeys.forEach((month, i) => {
      centroidObj[month] = cluster.centroids[i] || 0;
    });

    return centroidObj;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const scatterCombinations = [];
  for (let i = 0; i < monthKeys.length; i++) {
    for (let j = i + 1; j < monthKeys.length; j++) {
      scatterCombinations.push([monthKeys[i], monthKeys[j]]);
    }
  }

  return (
    <div className="mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {clusteringDetails.name}
          </h1>
          <div className="flex items-center space-x-2">
            {clusteringDetails.isConverged ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium">Converged</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium">Not Converged</span>
              </div>
            )}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                clusteringDetails.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {clusteringDetails.status}
            </span>
          </div>
        </div>

        {clusteringDetails.description && (
          <p className="text-gray-600 mb-4">{clusteringDetails.description}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">File</p>
              <p className="font-medium">{clusteringDetails.fileName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Total Siswa</p>
              <p className="font-medium">{clusteringDetails.totalStudents}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Iterasi</p>
              <p className="font-medium">
                {clusteringDetails.actualIterations}/
                {clusteringDetails.maxIterations}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-500">Dibuat</p>
              <p className="font-medium">
                {formatDate(clusteringDetails.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "charts", label: "Visualisasi", icon: BarChart3 },
              { id: "details", label: "Detail Data", icon: FileText },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() =>
                  setActiveTab(id as "overview" | "charts" | "details")
                }
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clusteringDetails.clusters.map((cluster, index) => (
                  <div
                    key={cluster.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    style={{
                      borderLeftColor:
                        clusterColors[index % clusterColors.length],
                      borderLeftWidth: "4px",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {cluster.label}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Jumlah Siswa:
                        </span>
                        <span className="font-medium">
                          {cluster.totalPoints}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p className="font-medium mb-1">Centroid:</p>
                        <ul className="space-y-1">
                          {monthKeys.map((month, i) => (
                            <li key={month}>
                              • {month}:{" "}
                              {(cluster.centroids[i] || 0).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Statistik Clustering
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {clusteringDetails.clusters.length}
                    </div>
                    <div className="text-sm text-gray-500">Total Cluster</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {clusteringDetails.totalStudents}
                    </div>
                    <div className="text-sm text-gray-500">Total Siswa</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {clusteringDetails.actualIterations}
                    </div>
                    <div className="text-sm text-gray-500">Iterasi</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "charts" && (
            <div className="space-y-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2" />
                  Distribusi Cluster
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clusterDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${((percent as number) * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {clusterDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Perbandingan Centroid
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={centroidData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cluster" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {monthKeys.map((month, i) => (
                        <Bar
                          key={month}
                          dataKey={month}
                          fill={clusterColors[i % clusterColors.length]}
                          name={month}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {scatterCombinations.map(([monthX, monthY]) => (
                <div
                  key={`${monthX}-${monthY}`}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {monthX} vs {monthY}
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="x" name={monthX} />
                        <YAxis type="number" dataKey="y" name={monthY} />
                        <Tooltip
                          cursor={{ strokeDasharray: "3 3" }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-2 border border-gray-200 rounded shadow-md">
                                  <p className="font-semibold text-sm">
                                    {data.name}
                                  </p>
                                  <p className="text-xs">
                                    {monthX}: {data.x}, {monthY}: {data.y}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        {clusteringDetails.clusters.map((cluster, index) => (
                          <Scatter
                            key={cluster.id}
                            name={cluster.label}
                            data={cluster.clusteringResults.map((result) => {
                              const getPaymentValue = (monthKey: string) => {
                                if (
                                  result.monthlyPayments[monthKey] !== undefined
                                ) {
                                  return result.monthlyPayments[monthKey];
                                }
                                const lowerKey = monthKey.toLowerCase();
                                if (
                                  result.monthlyPayments[lowerKey] !== undefined
                                ) {
                                  return result.monthlyPayments[lowerKey];
                                }
                                return 0;
                              };

                              return {
                                x: getPaymentValue(monthX),
                                y: getPaymentValue(monthY),
                                name: result.studentName,
                              };
                            })}
                            fill={clusterColors[index % clusterColors.length]}
                          />
                        ))}
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCluster(null)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    selectedCluster === null
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Semua Cluster
                </button>
                {clusteringDetails.clusters.map((cluster, index) => (
                  <button
                    key={cluster.id}
                    onClick={() => setSelectedCluster(cluster.clusterIndex)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      selectedCluster === cluster.clusterIndex
                        ? "text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    style={{
                      backgroundColor:
                        selectedCluster === cluster.clusterIndex
                          ? clusterColors[index % clusterColors.length]
                          : undefined,
                    }}
                  >
                    {cluster.label}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Siswa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NIS
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kelas
                        </th>
                        {monthKeys.map((month) => (
                          <th
                            key={month}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {month}
                          </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cluster
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clusteringDetails.clusters
                        .filter(
                          (cluster) =>
                            selectedCluster === null ||
                            cluster.clusterIndex === selectedCluster
                        )
                        .flatMap((cluster) =>
                          cluster.clusteringResults.map((result, resultIdx) => {
                            const getPaymentValue = (monthKey: string) => {
                              if (
                                result.monthlyPayments[monthKey] !== undefined
                              ) {
                                return result.monthlyPayments[monthKey];
                              }
                              const lowerKey = monthKey.toLowerCase();
                              if (
                                result.monthlyPayments[lowerKey] !== undefined
                              ) {
                                return result.monthlyPayments[lowerKey];
                              }
                              return 0;
                            };

                            return (
                              <tr
                                key={result.id}
                                className="hover:bg-gray-50"
                                style={{
                                  backgroundColor: `${
                                    clusterColors[
                                      cluster.clusterIndex %
                                        clusterColors.length
                                    ]
                                  }10`,
                                }}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {resultIdx + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {result.studentName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {result.nis}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {result.grade}
                                </td>
                                {monthKeys.map((month) => (
                                  <td
                                    key={month}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                  >
                                    {getPaymentValue(month)}
                                  </td>
                                ))}
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className="px-2 py-1 text-xs font-medium rounded-full text-white"
                                    style={{
                                      backgroundColor:
                                        clusterColors[
                                          cluster.clusterIndex %
                                            clusterColors.length
                                        ],
                                    }}
                                  >
                                    {result.clusterLabel}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
