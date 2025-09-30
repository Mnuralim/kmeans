"use client";

import React, { useState } from "react";
import { SearchButton } from "./search-button";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export const Filter = () => {
  const [studentId, setStudentId] = useState<string>("");
  const router = useRouter();
  const handleRedirect = () => {
    router.push(`/payments/${studentId}`, { scroll: false });
  };
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Cari Siswa Berdasarkan NIS
        </h2>
        <form action={handleRedirect} className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Masukkan NIS siswa..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <SearchButton />
        </form>
      </div>
      <p className="text-sm text-gray-600 mt-2 mb-10">
        *Pembayaran dilakukan dengan cara mencari tagihan siswa berdasarkan NIS
      </p>
    </>
  );
};
