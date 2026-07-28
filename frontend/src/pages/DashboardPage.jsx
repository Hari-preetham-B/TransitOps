import { useEffect, useState } from "react";
import {
  Truck,
  CheckCircle,
  Wrench,
  Route,
  Clock3,
  Users,
  Activity,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import StatCard from "../components/dashboard/StatCard";

import { getDashboardStats } from "../services/dashboardService";

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Vehicles"
          value={stats.activeVehicles}
          trend="+12%"
          color="text-emerald-600"
          icon={Truck}
          bg="bg-emerald-100"
        />

        <StatCard
          title="Available Vehicles"
          value={stats.availableVehicles}
          trend="+8%"
          color="text-blue-600"
          icon={CheckCircle}
          bg="bg-blue-100"
        />

        <StatCard
          title="Maintenance"
          value={stats.vehiclesInMaintenance}
          trend="-3%"
          color="text-orange-500"
          icon={Wrench}
          bg="bg-orange-100"
        />

        <StatCard
          title="Active Trips"
          value={stats.activeTrips}
          trend="+5%"
          color="text-violet-600"
          icon={Route}
          bg="bg-violet-100"
        />

        <StatCard
          title="Pending Trips"
          value={stats.pendingTrips}
          trend="+2%"
          color="text-yellow-500"
          icon={Clock3}
          bg="bg-yellow-100"
        />

        <StatCard
          title="Drivers on Duty"
          value={stats.driversOnDuty}
          trend="+4%"
          color="text-cyan-600"
          icon={Users}
          bg="bg-cyan-100"
        />

        <StatCard
          title="Fleet Utilization"
          value={`${stats.fleetUtilization}%`}
          trend="+6%"
          color="text-indigo-600"
          icon={Activity}
          bg="bg-indigo-100"
        />
      </div>

      {/* Charts */}
      <DashboardCharts />
    </DashboardLayout>
  );
}

export default DashboardPage;
