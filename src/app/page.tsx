import { getStats } from "@/actions/stats";
import { DashboardStats } from "./_components/dashboard";

export default async function Home() {
  const stats = await getStats();
  return (
    <div>
      <DashboardStats stats={stats} />
    </div>
  );
}
