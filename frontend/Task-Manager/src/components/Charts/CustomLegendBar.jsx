import React from "react";
import { toPersianDigits } from "../../utils/helper";

// Map of priority levels from English to Persian labels
const labelMapForPriority = {
  Low: "کم",
  Medium: "متوسط",
  High: "زیاد",
};

function CustomLegendBar({ payload }) {
  // If there is no data, return nothing
  if (!payload || !payload.length) return null;

  return (
    // Container for all legend items (flex layout with spacing)
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 max-w-full">
      {payload.map((entry, index) => (
        // Single legend item (color + label + count)
        <div
          key={`legend-${index}`} // Unique key for each legend item
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-gray-100 shadow-sm"
        >
          {console.log(entry)} {/* Debugging: logs legend entry to console */}
          {/* Colored circle for priority */}
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {/* Priority label and its count */}
          <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
            {/* Show Persian label if available, fallback to original value */}
            {labelMapForPriority[entry.value] || entry.value}:
            {/* Display the count in Persian digits */}
            {` ${toPersianDigits(entry.payload.count)}`}
          </span>
        </div>
      ))}
    </div>
  );
}

export default CustomLegendBar;
