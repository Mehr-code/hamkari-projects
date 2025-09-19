import React from "react";
import { toPersianDigits } from "../../utils/helper";

import { CheckCircle, Clock, Loader } from "lucide-react";

function UserCard({ userInfo }) {
  return (
    // Main container with styling
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl transition-transform hover:scale-105">
      {/* User profile section */}
      <div className="flex items-center gap-4 ">
        <img
          src={userInfo.profileImageUrl}
          alt={`Avatar ${userInfo.name}`}
          className="w-14 h-14 rounded-full border-2 border-gray-300 shadow-sm"
        />
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {userInfo?.name}
          </p>
          <p className="text-sm text-gray-500">{userInfo?.email}</p>
        </div>
      </div>

      {/* Stats section */}
      <div className="flex items-stretch gap-4 mt-6">
        <StatCard
          label="بدون شروع"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
          icon={
            <Clock
              size={60}
              className="absolute -right-[10%] top-0 opacity-25"
            />
          }
        />
        <StatCard
          label="در حال پیشرفت"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
          icon={
            <Loader
              size={60}
              className="absolute -right-[10%] top-0 opacity-20"
            />
          }
        />
        <StatCard
          label="تکمیل شده"
          count={userInfo?.compeletedTasks || 0}
          status="Completed"
          icon={
            <CheckCircle
              size={60}
              className="absolute -right-[10%] top-0 opacity-20"
            />
          }
        />
      </div>
    </div>
  );
}

export default UserCard;

// Reusable statistic card component
const StatCard = ({ label, count, status, icon }) => {
  // Return different styles based on task status
  const getStatusStyle = () => {
    switch (status) {
      case "Pending":
        return "bg-purple-50 text-purple-600 border-l-4 border-purple-400";
      case "In Progress":
        return "bg-cyan-50 text-cyan-600 border-l-4 border-cyan-400";
      case "Completed":
        return "bg-green-50 text-green-600 border-l-4 border-green-400";
      default:
        return "bg-gray-50 text-gray-600 border-l-4 border-gray-400";
    }
  };

  return (
    // Card container with dynamic style
    <div
      className={`relative overflow-hidden flex-1 rounded-lg shadow-sm px-1 py-2 ${getStatusStyle()} flex flex-col justify-center items-center`}
    >
      {/* Count + Icon */}
      <div className="flex gap-2">
        {icon}
        <span className="text-sm text-nowrap">
          {`${count === 0 ? "بدون" : toPersianDigits(count)} وظیفه ی`}
        </span>
      </div>

      {/* Task status label */}
      <div className="text-xs opacity-70 text-nowrap">{label}</div>
    </div>
  );
};
