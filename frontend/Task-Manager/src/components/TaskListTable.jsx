import React from "react";
import moment from "moment-jalaali"; // Import Moment.js with Jalaali calendar support
import "moment/locale/fa"; // Load Persian locale for formatting dates

function TaskListTable({ tableData }) {
  // Function to determine badge color classes based on task status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-lime-200 text-lime-600 border-green-300"; // Green badge for completed tasks
      case "Pending":
        return "bg-purple-200 text-purple-600 border-purple-300"; // Purple badge for pending tasks
      case "In Progress":
        return "bg-cyan-200 text-cyan-600 border-cyan-300"; // Cyan badge for in-progress tasks
      default:
        return "bg-gray-200 text-gray-600 border-gray-300"; // Gray badge for unknown status
    }
  };

  // Function to determine badge color classes based on task priority
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-500 border-red-200"; // Red badge for high priority
      case "Medium":
        return "bg-orange-100 text-orange-500 border-orange-200"; // Orange badge for medium priority
      case "Low":
        return "bg-yellow-100 text-yellow-500 border-yellow-200"; // Yellow badge for low priority
      default:
        return "bg-gray-100 text-gray-500 border-gray-200"; // Gray badge for unknown priority
    }
  };

  function statusMapper(status) {
    switch (status) {
      case "Completed":
        return "تکمیل شده";
      case "Pending":
        return "بدون شروع";
      case "In Progress":
        return "در حال پیشرفت";
      default:
        return "بدون وضعیت";
    }
  }

  function priorityMapper(priority) {
    switch (priority) {
      case "High":
        return "بالا";
      case "Medium":
        return "متوسط";
      case "Low":
        return "پایین";
      default:
        return "بدون الویت";
    }
  }

  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      {/* Table container with horizontal scroll for smaller screens */}
      <table className="min-w-full">
        <thead>
          <tr className="text-right">
            {/* Table headers */}
            <th className="py-3 px-12 text-gray-800 font-medium text-[13px]">
              فعالیت
            </th>
            <th className="py-3 px-12 text-gray-800 font-medium text-[13px]">
              وضعیت
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">
              الویت
            </th>
            <th className="py-3 px-6 text-gray-800 font-medium text-[13px] hidden md:table-cell">
              تاریخ انتشار
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Render each task row */}
          {tableData.map((task) => (
            <tr key={task._id} className="border-t border-gray-200">
              {/* Task title */}
              <td className="my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden">
                {task.title}
              </td>

              {/* Task status with badge */}
              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 text-xs w-24 text-center rounded inline-block ${getStatusBadgeColor(
                    task.status
                  )}`}
                >
                  {statusMapper(task.status)}
                </span>
              </td>

              {/* Task priority with badge */}
              <td>
                <span
                  className={`px-2 py-1 text-xs w-14 text-center rounded inline-block ${getPriorityBadgeColor(
                    task.priority
                  )}`}
                >
                  {priorityMapper(task.priority)}
                </span>
              </td>

              {/* Task creation date formatted in Jalaali calendar */}
              <td className="py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell">
                {task.createdAt
                  ? moment(task.createdAt).locale("fa").format("jD jMMMM jYYYY") // e.g., ۲۰ شهریور ۱۴۰۴
                  : "بدون تاریخ"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskListTable;
