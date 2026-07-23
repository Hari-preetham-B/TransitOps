import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

const data = [
  { week: "W1", count: 4 },
  { week: "W2", count: 6 },
  { week: "W3", count: 3 },
  { week: "W4", count: 8 },
];

function MaintenanceBarChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis
          dataKey="week"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
        />

        <Tooltip />

        <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MaintenanceBarChart;
