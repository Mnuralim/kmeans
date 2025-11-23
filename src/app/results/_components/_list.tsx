"use client";

import type { ClusteringHistory } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { Trash2 } from "lucide-react";
import { deleteClusteringHistory } from "@/actions/clustering";

interface Props {
  sessions: ClusteringHistory[];
}

export const ListResult = ({ sessions }: Props) => {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Riwayat Clustering</h2>

        {sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Belum ada history clustering. Silakan lakukan clustering terlebih
            dahulu.
          </p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div
                    onClick={() => router.push(`/results/${session.id}`)}
                    className="flex-1 cursor-pointer"
                  >
                    <h3 className="font-semibold text-lg">{session.name}</h3>
                    {session.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {session.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>📁 {session.fileName}</span>
                      <span>📊 {session.totalStudents} data</span>
                      <span>
                        📅 {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        session.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : session.status === "PROCESSING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {session.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const confirmed = confirm(
                          `Apakah Anda yakin ingin menghapus "${session.name}"?\n\nData clustering ini akan dihapus permanen.`
                        );
                        if (confirmed) {
                          deleteClusteringHistory(session.id);
                        }
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Hapus"
                    >
                      <Trash2 className="w-5 h-5 text-gray-400 cursor-pointer group-hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
