const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");

// @desc    Export all tasks as an Exel file
// @route   GET /api/reports/export/tasks
// @access  Private (admin only)
const exportTaskReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("گزارش کارها");

    worksheet.columns = [
      { header: "شناسه کار", key: "_id", width: 25 },
      { header: "عنوان", key: "title", width: 30 },
      { header: "توضیحات", key: "description", width: 50 },
      { header: "اولویت", key: "priority", width: 15 },
      { header: "وضعیت", key: "status", width: 20 },
      { header: "تاریخ سررسید", key: "dueDate", width: 20 },
      { header: "مسئول", key: "assignedTo", width: 30 },
    ];

    // RTL header
    worksheet.getRow(1).eachCell((cell) => {
      cell.alignment = { horizontal: "right" };
    });

    // RTL data
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "right" };
      });
    });

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((user) => `${user.name} (${user.email})`)
        .json(", ");
      worksheet.addRows({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "بدون مسئول",
      });
    });

    res.serHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.serHeader(
      "Content-Disposition",
      "attachment; filename=tasks_report.xlsx"
    );

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "خطا هنگام استخراج تسک ها", error: err.message });
  }
};

// @desc    Export user-task report as an Excel file
// @route   GET /api/reports/export/users
// @access  Pivate(admin only)
const exportUserReport = async (req, res) => {
  try {
    const users = await User.find().select("name email _id").lean();
    const userTasks = await Task.find().populate(
      "assignedTo",
      "name email _id"
    );

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

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("گزارش تسک‌های کاربر");

    worksheet.columns = [
      {
        header: "نام کاربر",
        key: "name",
        width: 30,
      },
      {
        header: "ایمیل",
        key: "email",
        width: 40,
      },
      {
        header: "تعداد کل تسک‌ها",
        key: "taskCount",
        width: 20,
      },
      {
        header: "تسک‌های در انتظار",
        key: "pendingTasks",
        width: 20,
      },
      {
        header: "تسک‌های در حال انجام",
        key: "inProgressTasks",
        width: 20,
      },
      {
        header: "تسک‌های تکمیل‌شده",
        key: "completedTasks",
        width: 20,
      },
    ];

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });
    res.serHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.serHeader(
      "Content-Disposition",
      "attachment; filename=tasks_report.xlsx"
    );

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "خطا هنگام استخراج تسک ها", error: err.message });
  }
};

module.exports = {
  exportTaskReport,
  exportUserReport,
};
