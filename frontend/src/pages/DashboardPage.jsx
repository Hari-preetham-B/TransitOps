import { useEffect, useState } from "react";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentTrips from "../components/dashboard/RecentTrips";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import DashboardFilters from "../components/dashboard/DashboardFilters";
import { getDashboardStats } from "../services/dashboardService";

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    vehicleType: "",
    region: "",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const data = await getDashboardStats(filters);

        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [filters]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <h2 className="text-xl font-semibold text-slate-600">
            Loading Dashboard...
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader />
      <DashboardFilters filters={filters} setFilters={setFilters} />
      <DashboardStats stats={stats} />
      {/* Charts */}
      <DashboardCharts />
      <div className="mt-8">
        <RecentTrips />
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
