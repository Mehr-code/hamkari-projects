import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { toPersianDigits } from "../../utils/helper";
import CustomLegend from "./CustomLegendBar"; // Legend component similar to PieChart but specifically designed for BarChart

// Utility function to determine bar color based on task priority
const getBarColor = (entry) => {
  switch (entry?.priority) {
    case "Low":
      return "#EAB308"; // Yellow for low priority
    case "Medium":
      return "#F97316"; // Orange for medium priority
    case "High":
      return "#EF4444"; // Red for high priority
    default:
      return "#EAB308"; // Fallback color
  }
};

// Mapping English priority keys to Persian labels
const labelMapForPriority = {
  Low: "پایین",
  Medium: "متوسط",
  High: "بالا",
};

// Custom tooltip component for displaying task details in Persian
const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-2 border-gray-300">
        <p className="text-xs font-semibold text-gray-800 mb-1">
          {labelMapForPriority[payload[0].payload.priority]}
        </p>
        <p className="text-sm font-medium text-gray-900">
          تعداد: <span>{toPersianDigits(payload[0].payload.count)}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Main BarChart component
function CustomBarChart({ data = [] }) {
  // Display a message if there is no data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        هیچ وظیفه‌ای موجود نیست!
      </div>
    );
  }

  return (
    <div className="bg-white mt-6 p-4 rounded-lg shadow-sm">
      <ResponsiveContainer width="100%" height={270}>
        <BarChart data={data}>
          {/* Remove grid lines for a cleaner look */}
          <CartesianGrid stroke="none" />

          {/* Custom XAxis rendering with styled labels */}
          <XAxis
            dataKey="priority"
            tick={({ x, y, payload }) => (
              <foreignObject x={x - 29} y={y - 10} width={60} height={40}>
                <div className="flex items-center justify-center px-4 py-1 mt-2 rounded-full bg-gray-100 shadow-sm text-sm text-gray-700 ">
                  {labelMapForPriority[payload.value] || payload.value}
                </div>
              </foreignObject>
            )}
            stroke="none"
            tickFormatter={(value) => labelMapForPriority[value] || value}
          />

          {/* YAxis with Persian digits */}
          <YAxis
            tick={{ fontSize: 14, fill: "#555" }}
            stroke="none"
            tickFormatter={(value) => toPersianDigits(value)}
          />

          {/* Custom tooltip */}
          <Tooltip
            content={CustomBarTooltip}
            cursor={{ fill: "transparent" }}
          />

          {/* Bars with dynamic colors based on priority */}
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomBarChart;
