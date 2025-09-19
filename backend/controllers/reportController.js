const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");

const moment = require("moment-jalaali");
require("moment/locale/fa");
// Configure moment-jalaali for Persian with Persian digits
moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

/**
 * @desc    Export all tasks as an Excel file
 * @route   GET /api/reports/export/tasks
 * @access  Private (admin only)
 */

const exportTaskReport = async (req, res) => {
  /**
   * Format any date to Jalaali/Persian format with Persian digits
   * Example output: "۲۰ شهریور ۱۴۰۴"
   */
  function formatJalaaliDate(date) {
    if (!date) return "بدون تاریخ";

    let m;

    if (typeof date === "string" || date instanceof Date) {
      m = moment(date);
    } else {
      return "بدون تاریخ";
    }

    if (!m.isValid()) return "بدون تاریخ";

    return `${m.jYear()}/${m.jMonth() + 1}/${m.jDate()}`;
  }

  // priority mapper
  const priorityMapper = {
    High: "بالا",
    Medium: "متوسط",
    Low: "پایین",
  };

  // priority mapper
  const stateMapper = {
    Pending: "بدون شروع",
    "In Progress": "در حال پیشرفت",
    Completed: "تکمیل شده",
  };

  try {
    // Fetch all tasks and populate "assignedTo" with user info
    const tasks = await Task.find().populate("assignedTo", "name email");

    // Create a new workbook and worksheet
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("گزارش وظایف");

    // Define worksheet columns
    worksheet.columns = [
      { header: "شناسه کار", key: "_id", width: 25 },
      { header: "عنوان", key: "title", width: 30 },
      { header: "توضیحات", key: "description", width: 50 },
      { header: "اولویت", key: "priority", width: 15 },
      { header: "وضعیت", key: "status", width: 20 },
      { header: "تاریخ سررسید", key: "dueDate", width: 20 },
      { header: "واگذار شده به", key: "assignedTo", width: 30 },
    ];

    // Align headers to the right (RTL)
    worksheet.getRow(1).eachCell((cell) => {
      cell.alignment = { horizontal: "right" };
    });

    // Add task rows
    tasks.forEach((task) => {
      const assignedTo =
        Array.isArray(task.assignedTo) && task.assignedTo.length
          ? task.assignedTo
              .map((user) => `${user.name} (${user.email})`)
              .join(", ")
          : "بدون مسئول"; // Default text if no users assigned

      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: priorityMapper[task.priority] || task.priority,
        status: stateMapper[task.status] || task.status,
        dueDate: formatJalaaliDate(task.dueDate),
        assignedTo: assignedTo || "بدون مسئول",
      });
    });

    // Align all rows to the right (RTL)
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "right" };
      });
    });

    // Set response headers for Excel download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=tasks_report.xlsx"
    );

    // Write workbook to response stream
    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (err) {
    res.status(500).json({
      message: "خطا هنگام استخراج تسک ها",
      error: err.message,
    });
  }
};

/**
 * @desc    Export user-task statistics as an Excel file
 * @route   GET /api/reports/export/users
 * @access  Private (admin only)
 */
const exportUserReport = async (req, res) => {
  try {
    // Fetch users and tasks
    const users = await User.find().select("name email _id").lean();
    const userTasks = await Task.find().populate(
      "assignedTo",
      "name email _id"
    );

    // Map to store task statistics per user
    const userTaskMap = {};
    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    // Count tasks for each user
    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1;
            if (task.status === "Pending") {
              userTaskMap[assignedUser._id].pendingTasks += 1;
            } else if (task.status === "In Progress") {
              userTaskMap[assignedUser._id].inProgressTasks += 1;
            } else if (task.status === "Completed") {
              userTaskMap[assignedUser._id].completedTasks += 1;
            }
          }
        });
      }
    });

    // Create workbook and worksheet
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("گزارش تسک‌های کاربر");

    // Define worksheet columns
    worksheet.columns = [
      { header: "نام کاربر", key: "name", width: 30 },
      { header: "ایمیل", key: "email", width: 40 },
      { header: "تعداد کل وظایف", key: "taskCount", width: 20 },
      { header: "وظیفه‌های بدون شروع", key: "pendingTasks", width: 20 },
      { header: "وظیفه‌های در حال پیشرفت", key: "inProgressTasks", width: 20 },
      { header: "وظیفه‌های تکمیل شده", key: "completedTasks", width: 20 },
    ];

    // Add rows for each user
    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });

    // Align all rows to the right (RTL)
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "right" };
      });
    });

    // Set response headers for Excel download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users_report.xlsx"
    );

    // Write workbook to response stream
    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (err) {
    res.status(500).json({
      message: "خطا هنگام استخراج تسک ها",
      error: err.message,
    });
  }
};

module.exports = {
  exportTaskReport,
  exportUserReport,
};
