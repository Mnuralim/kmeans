import { getClusteringDetails } from "@/actions/clustering";
import { ClusteringResults } from "./_components/result";

interface Props {
  params: Promise<{
    id: string;
  }>;
}
export default async function ClusteringDetailPage({ params }: Props) {
  const { id } = await params;
  const clusteringDetails = await getClusteringDetails(id);
  if (!clusteringDetails) {
    return <div className="text-red-500">Clustering history not found.</div>;
  }

  return (
    <div>
      <ClusteringResults clusteringDetails={clusteringDetails} />
    </div>
  );
}
