import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { toPersianDigits } from "../../utils/helper";
import CustomLegend from "./CustomeLegend";

// Color palette for pie chart slices
const colors = ["#8D51FF", "#00B8DB", "#7BCE00"];

// Mapping task statuses from English to Persian labels
const labelMapForTaskListTable = {
  Pending: "بدون شروع",
  "In Progress": "در حال پیشرفت",
  Completed: "تکمیل شده",
};

// Custom tooltip component for pie chart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0]; // Get the first payload item
    return (
      <div className="bg-white shadow-md rounded-lg p-2 border-gray-300">
        {/* Show Persian label for status */}
        <p className="text-xs font-semibold text-gray-800 mb-1">
          {labelMapForTaskListTable[data.name]}
        </p>
        {/* Show count in Persian digits */}
        <p className="text-sm font-medium text-gray-900">
          تعداد: {toPersianDigits(data.value)}
        </p>
      </div>
    );
  }
  return null;
};

function CustomPieChart({ data = [], showLabel = false }) {
  // Show message if there is no data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[325px] text-gray-400">
        هیچ وظیفه‌ای موجود نیست!
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={325}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count" // Determines slice size
          nameKey="status" // Status used as label key
          cx="50%" // Center X
          cy="50%" // Center Y
          outerRadius={130} // Outer radius of pie
          innerRadius={100} // Inner radius (donut chart effect)
          labelLine={false} // Hide default label line
          label={
            // Conditionally render custom labels if showLabel is true
            showLabel
              ? ({ name, value }) =>
                  `${labelMapForTaskListTable[name] || name}: ${toPersianDigits(
                    value
                  )}`
              : false
          }
        >
          {/* Render slices with colors */}
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>

        {/* Custom tooltip */}
        <Tooltip content={<CustomPieTooltip />} />

        {/* Custom legend */}
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CustomPieChart;
