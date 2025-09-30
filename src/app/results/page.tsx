import { getClusteringHistory } from "@/actions/clustering";
import { ListResult } from "./_components/_list";

export default async function HasilPage() {
  const clusteringSession = await getClusteringHistory();
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-lg">
      <div className="px-6 py-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Clustering Result
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Halaman ini akan menampilkan hasil clustering dari data yang telah
              diunggah.
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <ListResult sessions={clusteringSession} />
      </div>
    </div>
  );
}
