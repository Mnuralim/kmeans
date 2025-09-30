import { ClusteringForm } from "./_components/form";

export default function ClusteringPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        K-Means Clustering untuk Analisis Pembayaran SPP
      </h1>
      <ClusteringForm />
    </div>
  );
}
