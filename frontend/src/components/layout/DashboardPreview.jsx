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
    <div className="w-full max-w-3xl rounded-[28px] border border-white/30 bg-white/70 p-6 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(15,23,42,0.18)]">
      {/* Header */}

      <div className="mb-6 flex items-center justify-between border-b border-slate-200/60 pb-4">
        <div className="text-lg font-semibold text-slate-800">
          TransitOps Dashboard
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-500 shadow-sm backdrop-blur">
          🔍 Search vehicles...
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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="h-56 rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Fleet Analytics
          </h3>

          <div className="h-42.5">
            <FleetAreaChart />
          </div>
        </div>

        <div className="h-56 rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Maintenance Trend
          </h3>

          <div className="h-42.5">
            <MaintenanceBarChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPreview;
