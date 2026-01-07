// 🌈 Beautiful, colorful WeeklyChart UI
// Uses Recharts – smooth, gradient, modern look

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function WeeklyChart({ tasks }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // simple visualization: completed count spread across days
  const completed = tasks.filter(t => t.status === "DONE").length;

  const data = days.map((day, index) => ({
    day,
    value: index < completed ? 1 : 0
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#6366f1"
          strokeWidth={3}
          fill="url(#colorTasks)"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
