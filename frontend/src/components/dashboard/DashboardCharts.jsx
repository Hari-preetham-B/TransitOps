import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const fleetData = [
  { day: "Mon", trips: 18 },
  { day: "Tue", trips: 24 },
  { day: "Wed", trips: 21 },
  { day: "Thu", trips: 29 },
  { day: "Fri", trips: 34 },
  { day: "Sat", trips: 27 },
  { day: "Sun", trips: 31 },
];

const maintenanceData = [
  { month: "Jan", count: 4 },
  { month: "Feb", count: 6 },
  { month: "Mar", count: 3 },
  { month: "Apr", count: 8 },
  { month: "May", count: 5 },
];

function DashboardCharts() {
  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-semibold">Fleet Analytics</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={fleetData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="trips"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-semibold">Maintenance Trend</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={maintenanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashboardCharts;
