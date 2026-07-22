"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { week: "الأسبوع ١", progress: 42 },
  { week: "الأسبوع ٢", progress: 48 },
  { week: "الأسبوع ٣", progress: 51 },
  { week: "الأسبوع ٤", progress: 55 },
  { week: "الأسبوع ٥", progress: 61 },
  { week: "الأسبوع ٦", progress: 68 },
];

export function WeeklyProgressChart() {
  return (
    <div className="h-56 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2F6F6B" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#2F6F6B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E4DA" />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#6B7876" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: "#6B7876" }}
            axisLine={false}
            tickLine={false}
            unit="٪"
            width={36}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #E7E4DA", fontSize: 12 }}
            formatter={(value: number) => [`${value}٪`, "متوسط التقدم"]}
          />
          <Area
            type="monotone"
            dataKey="progress"
            stroke="#2F6F6B"
            strokeWidth={2.5}
            fill="url(#progressFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
