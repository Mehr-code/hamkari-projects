const Task = require("../models/Task");

// @desc    Get all Tasks (Admin: all, User: only assigned Tasks)
// @route   GET /api/tasks/
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }

    // Add completed todo Checklist count o each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoCheckList.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    // Status summary count
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Get Task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
    if (!task)
      return res.status(404).json({ message: "تسک مورد نظر شما یافت نشد." });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Create a New Task (For Admin Role Only)
// @route   POST /api/tasks/
// @access  Private (Admin)
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoCheckList,
    } = req.body;

    if (!Array.isArray(assignedTo))
      return res.status(400).json({
        message: "فیلد assignedTo باید آرایه‌ای از شناسه کاربران باشد",
      });

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      todoCheckList,
      attachments,
    });

    res.status(201).json({ message: "تسک شما با موفقیت ایجاد شد.", task });
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Update Task Details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ message: "تسک مورد نظر شما یافت نشد." });
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({
          message: "فیلد assignedTo باید آرایه‌ای از شناسه کاربران باشد",
        });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
    res.json({ message: "تسک مورد نظر با موفقیت بروزرسانی شد", updatedTask });
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Delete a Task (for Admin Role only)
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.status(404).json({ message: "تسک مورد نظر شما یافت نشد." });

    await task.deleteOne();
    res.status(200).json({ message: "تسک مورد نظر شما با موفقیت حذف شد." });
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Update Task Status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ message: "تسک مورد نظر شما یافت نشد." });

    const isAssgined = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssgined && req.user.role !== "admin") {
      return res.status(403).json({ message: "شما دسترسی ادمین ندارید." });
    }

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoCheckList.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({ message: "تسک مورد نظر شما با موفقیت بروزرسانی شد.", task });
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Update Task Checklist
// @route   PUT /api/tasks/:id/checklist
// @access  Private
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoCheckList } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ message: "تسک مورد نظر شما یافت نشد." });

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "شما دسترسی ادمینی ندارید." });
    }

    task.todoCheckList = todoCheckList; // Replacing With the New Task

    // Auto-update progress based on chcklist completion
    const completedCount = task.todoCheckList.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoCheckList.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    // Auto-mark task as completed if all items are checked
    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({ message: "لیست وظیقه با موفیت بروزرسانی شد", task: updateTask });
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Dashboard Data(for Admin Role only)
// @route   GET /api/tasks/dashboard-data
// @access  Private
const getDashboardData = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Dashboard Data (User-specefic)
// @route   GET /api/tasks/user-dashboard-data
// @access  Private
const getUserDashboardData = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
