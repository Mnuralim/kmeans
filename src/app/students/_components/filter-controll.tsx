import React from "react";
import { ChevronDown, Search, SortAsc, SortDesc } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  currentSortOrder?: string;
}

export const StudentFilterControl = ({ currentSortOrder }: Props) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: "created_at", label: "Tanggal Dibuat" },
    { value: "name", label: "Nama" },
    { value: "nis", label: "NIS" },
    { value: "nisn", label: "NISN" },
    { value: "grade", label: "Kelas" },
  ];

  const classOptions = [
    { value: "ALL", label: "Semua Kelas" },
    { value: "1", label: "Kelas 1" },
    { value: "2", label: "Kelas 2" },
    { value: "3", label: "Kelas 3" },
    { value: "4", label: "Kelas 4" },
    { value: "5", label: "Kelas 5" },
    { value: "6", label: "Kelas 6" },
  ];

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newParams = new URLSearchParams(searchParams);
      if (e.target.value) {
        newParams.set("search", e.target.value);
      } else {
        newParams.delete("search");
      }
      replace(`/students?${newParams.toString()}`, {
        scroll: false,
      });
    },
    500
  );

  const handleFilterClass = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "") {
      newParams.delete("grade");
    } else {
      newParams.set("grade", e.target.value);
    }
    replace(`/students?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", e.target.value);
    replace(`/students?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleSortOrder = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
    replace(`/students?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="flex items-center mb-3">
          <Search className="w-5 h-5 mr-2 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Pencarian</h3>
        </div>
        <div className="relative">
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Cari berdasarkan nama, NIS, atau NISN..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex-1">
          <div className="flex items-center mb-3">
            <ChevronDown className="w-5 h-5 mr-2 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filter</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kelas
              </label>
              <div className="relative">
                <select
                  onChange={handleFilterClass}
                  defaultValue={searchParams.get("grade") || "ALL"}
                  className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {classOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 lg:w-80">
          <div className="flex items-center mb-3">
            {currentSortOrder === "asc" ? (
              <SortAsc className="w-5 h-5 mr-2 text-gray-600" />
            ) : (
              <SortDesc className="w-5 h-5 mr-2 text-gray-600" />
            )}
            <h3 className="font-semibold text-gray-900">Urutkan</h3>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutkan berdasarkan
              </label>
              <select
                onChange={handleSortBy}
                defaultValue={searchParams.get("sortBy") || "name"}
                className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutan
              </label>
              <button
                onClick={handleSortOrder}
                className="bg-gray-50 border border-gray-300 rounded-md p-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                title={currentSortOrder === "asc" ? "Ascending" : "Descending"}
              >
                {currentSortOrder === "asc" ? (
                  <SortAsc className="w-5 h-5 text-gray-600" />
                ) : (
                  <SortDesc className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
