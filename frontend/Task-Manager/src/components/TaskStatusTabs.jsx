import React from "react";
import { toPersianDigits } from "../utils/helper";

// Label translations for different task statuses
const labelTranslations = {
  All: "همه",
  Pending: "بدون شروع",
  "In Progress": "در حال پیشرفت",
  Completed: "تکمیل شده",
};

function TaskStatusTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="my-2">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;

          return (
            <button
              key={"tab" + tab.label} // unique key for React
              className={`relative px-3 md:px-4 py-2 text-sm font-medium ${
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-700"
              } cursor-pointer`}
              onClick={() => setActiveTab(tab.label)}
              aria-pressed={isActive} // accessibility hint
            >
              <div className="flex items-center">
                {/* Display translated label */}
                <span className="text-xs">
                  {labelTranslations[tab.label] || tab.label}
                </span>

                {/* Status count badge */}
                <span
                  className={`text-xs mr-2 px-2 py-0.5 rounded-full ${
                    isActive ? "bg-primary text-white" : "bg-gray-200/100"
                  }`}
                >
                  {toPersianDigits(tab.count)}
                </span>
              </div>

              {/* Underline: animate width from 0 -> full, anchored to right (good for RTL) */}
              <div
                className={`absolute bottom-0 right-0 h-0.5 bg-primary transition-[width,opacity] duration-500 ${
                  isActive ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
                style={{ willChange: "width, opacity" }}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TaskStatusTabs;
