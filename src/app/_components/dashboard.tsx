"use client";
import React from "react";
import {
  Users,
  CreditCard,
  TrendingUp,
  Calendar,
  UserCheck,
  AlertTriangle,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface StatsData {
  totalStudents: number;
  activeStudents: number;
  totalPayments: number;
  pendingPayments: number;
  currentAcademicYear: string;
  lastClusteringDate: string | null;
  paymentTrends: Array<{
    month: string;
    paid: number;
    pending: number;
  }>;
  gradeDistribution: Array<{
    grade: string;
    students: number;
  }>;
  clusterResults: Array<{
    cluster: string;
    count: number;
    percentage: number;
  }>;
}

interface DashboardStatsProps {
  stats: StatsData;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color?: "blue" | "green" | "orange" | "purple";
}) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    green: "bg-green-50 border-green-100 text-green-600",
    orange: "bg-orange-50 border-orange-100 text-orange-600",
    purple: "bg-purple-50 border-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-slate-800 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs">
          <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
          <span className="text-green-600 font-medium">{trend}</span>
          <span className="text-slate-500 ml-1">dari bulan lalu</span>
        </div>
      )}
    </div>
  );
};

const ChartCard = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}
  >
    <h3 className="text-lg font-semibold text-slate-800 mb-6">{title}</h3>
    {children}
  </div>
);

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="min-h-screen bg-slate-50 ">
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">
            Selamat datang di sistem manajemen SD SWASTA YWKA MEDAN
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Siswa"
            value={stats.totalStudents.toLocaleString()}
            subtitle={`${stats.activeStudents} siswa aktif`}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Pembayaran Bulan Ini"
            value={formatCurrency(stats.totalPayments)}
            subtitle={`${formatCurrency(stats.pendingPayments)} tertunggak`}
            icon={CreditCard}
            color="green"
          />
          <StatCard
            title="Tahun Akademik"
            value={stats.currentAcademicYear}
            subtitle="Tahun akademik aktif"
            icon={Calendar}
            color="orange"
          />
          <StatCard
            title="Clustering Terakhir"
            value={stats.lastClusteringDate || "Belum ada"}
            subtitle="Analisis pembayaran"
            icon={BarChart3}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Tren Pembayaran (6 Bulan Terakhir)">
            {stats.paymentTrends && stats.paymentTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.paymentTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="paid"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    name="Lunas (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    name="Tertunggak (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Belum ada data tren pembayaran</p>
                </div>
              </div>
            )}
          </ChartCard>

          <ChartCard title="Distribusi Siswa per Kelas">
            {stats.gradeDistribution && stats.gradeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="grade" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="students"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Belum ada data distribusi kelas</p>
                </div>
              </div>
            )}
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            title="Hasil Clustering Pembayaran"
            className="lg:col-span-2"
          >
            {stats.clusterResults && stats.clusterResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.clusterResults.map((cluster, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {cluster.percentage}%
                    </div>
                    <p className="text-sm font-medium text-slate-800">
                      {cluster.cluster}
                    </p>
                    <p className="text-xs text-slate-500">
                      {cluster.count} siswa
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <PieChart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Belum ada hasil clustering</p>
                  <p className="text-xs mt-1">
                    Jalankan clustering untuk melihat hasil
                  </p>
                </div>
              </div>
            )}
          </ChartCard>

          <ChartCard title="Aksi Cepat">
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                <div className="flex items-center">
                  <UserCheck className="w-4 h-4 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-slate-700">
                    Input Pembayaran
                  </span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-slate-700">
                    Jalankan Clustering
                  </span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-orange-600 mr-3" />
                  <span className="text-sm font-medium text-slate-700">
                    Tambah Siswa
                  </span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-3" />
                  <span className="text-sm font-medium text-slate-700">
                    Cek Tunggakan
                  </span>
                </div>
              </button>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
