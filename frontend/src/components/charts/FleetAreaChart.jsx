import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

const data = [
  { day: "Mon", trips: 28 },
  { day: "Tue", trips: 41 },
  { day: "Wed", trips: 35 },
  { day: "Thu", trips: 52 },
  { day: "Fri", trips: 47 },
  { day: "Sat", trips: 61 },
  { day: "Sun", trips: 56 },
];

function FleetAreaChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
        />

        <Tooltip />

        <Area
          type="monotone"
          dataKey="trips"
          stroke="#2563eb"
          fill="#bfdbfe"
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default FleetAreaChart;
