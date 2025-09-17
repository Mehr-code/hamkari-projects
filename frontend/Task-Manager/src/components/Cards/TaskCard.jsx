import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import { toPersianDigits } from "../../utils/helper";

// Date handling (Moment with Jalaali support)
import moment from "moment-jalaali";
import "moment/locale/fa";

// Configure moment-jalaali for Persian with Persian digits
moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

function TaskCard({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) {
  // Return style classes for status tag
  const getStatusTagColor = () => {
    switch (status) {
      case "Pending":
        return "text-[#8D51FF] bg-[#F0E6FF] border border-[#8D51FF]/10";
      case "In Progress":
        return "text-[#00B8DB] bg-[#E0F7FF] border border-[#00B8DB]/10";
      case "Completed":
        return "text-[#7BCE00] bg-[#E6F6C0] border border-[#7BCE00]/10";
      default:
        return "text-[#8D51FF] bg-[#F0E6FF] border border-[#8D51FF]/10";
    }
  };

  // Return style classes for priority tag
  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-[#EAB308] bg-[#FFF6D0] border border-[#EAB308]/10";
      case "Medium":
        return "text-[#F97316] bg-[#FFE7D5] border border-[#F97316]/10";
      case "High":
        return "text-[#EF4444] bg-[#FFE5E5] border border-[#EF4444]/10";
      default:
        return "text-[#EAB308] bg-[#FFF6D0] border border-[#EAB308]/10";
    }
  };

  // Translations for status
  const statusTranslations = {
    Pending: "بدون شروع",
    "In Progress": "در حال پیشرفت",
    Completed: "تکمیل شده",
  };

  // Translations for priority
  const priorityTranslations = {
    Low: "پایین",
    Medium: "متوسط",
    High: "بالا",
  };

  return (
    <div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-200 border border-gray-200/75 cursor-pointer"
      onClick={onClick}
    >
      {/* Status and Priority tags */}
      <div className="flex items-start gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
        >
          {statusTranslations[status] || status}
        </div>
        <div
          className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}
        >
          {`الویت ${priorityTranslations[priority] || priority}`}
        </div>
      </div>

      {/* Main content */}
      <div
        className={`px-4 border-r-[3px] ${
          status === "Completed"
            ? "border-[#7BCE00]"
            : status === "In Progress"
            ? "border-[#00B8DB]"
            : "border-[#8D51FF]"
        }`}
      >
        {/* Title */}
        <p className="text-base font-medium text-gray-800 mt-4 line-clamp-2">
          {title}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>

        {/* Completed subtasks */}
        <p className="text-[14px] text-gray-700/100 font-medium mt-2 mb-2 leading-[18px]">
          ریز وظیفه های انجام شده:{" "}
          <span className="font-semibold text-gray-700">
            {completedTodoCount != null && todoChecklist != null
              ? `${toPersianDigits(todoChecklist)} / ${toPersianDigits(
                  completedTodoCount
                )}`
              : 0}
          </span>
        </p>

        {/* Progress bar */}
        <Progress progress={progress} status={status} />
      </div>

      {/* Footer section */}
      <div className="px-4">
        {/* Dates */}
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500">تاریخ شروع</label>
            <p className="text-[13px] font-medium text-gray-900">
              {createdAt
                ? moment(createdAt).locale("fa").format("jD jMMMM jYYYY")
                : "بدون تاریخ"}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500">تاریخ سر رسید</label>
            <p className="text-[13px] font-medium text-gray-900">
              {dueDate
                ? moment(dueDate).locale("fa").format("jD jMMMM jYYYY")
                : "بدون تاریخ"}
            </p>
          </div>
        </div>

        {/* Avatars and attachments */}
        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} />
          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-100 px-2.5 py-1.5 rounded-lg">
              <span className="text-sm text-gray-900">
                {toPersianDigits(attachmentCount)}
              </span>
              <LuPaperclip className="text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
