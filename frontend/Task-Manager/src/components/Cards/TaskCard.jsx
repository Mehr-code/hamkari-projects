import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import { toPersianDigits } from "../../utils/helper";

// Date handling
import moment from "moment-jalaali"; // Moment.js with Jalaali calendar
import "moment/locale/fa"; // Set Persian locale

// Configure moment-jalaali for Persian with Persian digits
moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
// Example output: سه‌شنبه، ۲۰ شهریور ۱۴۰۴

import { gregorianToJalaliDisplay } from "../../utils/helper";

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

  const statusTranslations = {
    Pending: "بدون شروع",
    "In Progress": "در حال پیشرفت",
    Completed: "تکمیل شده",
  };

  const priorityTranslations = {
    Low: "پایین",
    Medium: "متوسط",
    High: "بالا",
  };

  // Configure moment-jalaali for Persian with Persian digits
  moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
  // Example output: سه‌شنبه، ۲۰ شهریور ۱۴۰۴
  moment(dueDate).local().locale("fa").format("dddd، jD jMMMM jYYYY"); // سه‌شنبه، ۲۰ شهریور ۱۴۰۴

  return (
    <div className="bg-white rounded-xl" onClick={onClick}>
      <div className="">
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
      <div
        className={`px-4 border-r-[3px] ${
          status === "Completed"
            ? "border-[#7BCE00]"
            : status === "In Progress"
            ? "border-[#00B8DB]"
            : "border-[#8D51FF]"
        }`}
      >
        <p className="">{title}</p>
        <p className="">{description}</p>
        <p className="">
          ریز وظیفه های انجام شده:{" "}
          <span className="">
            {completedTodoCount != null && todoChecklist != null
              ? `${toPersianDigits(todoChecklist)} / ${toPersianDigits(
                  completedTodoCount
                )}`
              : 0}
          </span>
        </p>
        <Progress progress={progress} status={status} />
      </div>

      <div className="">
        <div className="">
          <div>
            <label className="">تاریخ شروع</label>
            <p className="">
              {createdAt
                ? moment(createdAt).locale("fa").format("jD jMMMM jYYYY") // e.g., ۲۰ شهریور ۱۴۰۴
                : "بدون تاریخ"}
              {/* {createdAt
                ? gregorianToJalaliDisplay(createdAt, { withWeekday: true })
                : "بدون تاریخ"} */}
            </p>
          </div>
          <div className="">
            <label className="">تاریخ سر رسید</label>
            <p className="">
              {dueDate
                ? moment(dueDate).locale("fa").format("jD jMMMM jYYYY") // e.g., ۲۰ شهریور ۱۴۰۴
                : "بدون تاریخ"}

              {/* {dueDate ? gregorianToJalaliDisplay(dueDate) : "بدون تاریخ"} */}
            </p>
          </div>
        </div>
        <div className="">
          <AvatarGroup avatars={assignedTo || {}} />

          {attachmentCount > 0 && (
            <div className="">
              <span className="">{attachmentCount}</span>
              <LuPaperclip className="" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
