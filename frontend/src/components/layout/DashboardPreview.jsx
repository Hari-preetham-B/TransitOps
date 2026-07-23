import FleetAreaChart from "../charts/FleetAreaChart";
import MaintenanceBarChart from "../charts/MaintenanceBarChart";
import StatCard from "../dashboard/StatCard";
import { Truck, Route, Activity, Wrench } from "lucide-react";

function DashboardPreview() {
  const cards = [
    {
      title: "Active Vehicles",
      value: "238",
      trend: "+12%",
      color: "text-green-600",
      icon: Truck,
    },
    {
      title: "Trips Today",
      value: "156",
      trend: "+8%",
      color: "text-blue-600",
      icon: Route,
    },
    {
      title: "Fleet Utilization",
      value: "72%",
      trend: "+5%",
      color: "text-purple-600",
      icon: Activity,
    },
    {
      title: "Maintenance",
      value: "18",
      trend: "-3%",
      color: "text-orange-500",
      icon: Wrench,
    },
  ];

  return (
    <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <div className="text-lg font-semibold text-slate-800">
          TransitOps Dashboard
        </div>

        <div className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-500">
          Search...
        </div>
      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            trend={card.trend}
            color={card.color}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Charts */}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="h-56 rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Fleet Analytics
          </h3>

          <div className="h-[170px]">
            <FleetAreaChart />
          </div>
        </div>

        <div className="h-56 rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Maintenance Trend
          </h3>

          <div className="h-[170px]">
            <MaintenanceBarChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPreview;
