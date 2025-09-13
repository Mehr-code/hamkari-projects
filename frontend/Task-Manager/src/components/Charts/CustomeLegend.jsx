import React from "react";
import { toPersianDigits } from "../../utils/helper";

// Map of status values from English to Persian labels
const labelMapForTaskListTable = {
  Pending: "بدون شروع",
  "In Progress": "در حال پیشرفت",
  Completed: "تکمیل شده",
};

// Custom component to render a legend with color indicators and counts
function CustomLegend({ payload }) {
  return (
    // Container that holds all legend items
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-full">
      {payload.map((entry, index) => (
        // Each legend item (color circle + status label + count)
        <div
          key={`item-${index}`} // Unique key for each legend item
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 rounded-full bg-gray-100 shadow-sm"
        >
          {/* Colored circle representing the status (color comes from entry.color) */}
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {/* Status label and count (numbers are converted to Persian digits) */}
          <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
            {/* Use Persian label if available, otherwise fallback to the original value */}
            {labelMapForTaskListTable[entry.value] || entry.value}
            {/* Display the count of items next to the status */}
            {`: ${toPersianDigits(entry.payload.count)}`}
          </span>
        </div>
      ))}
    </div>
  );
}

export default CustomLegend;
