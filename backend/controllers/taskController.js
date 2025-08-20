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
    const allTask = await Task.countDocuments(
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
        all: allTask,
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
      todoChecklist,
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
      todoChecklist,
      attachments,
    });

    res.status(201).json({ message: "ایجاد وظیفه با موفقیت انجام شد.", task });
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Update Task Details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Delete a Task (for Admin Role only)
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
const deleteTask = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Update Task Status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Update Task Checklist
// @route   PUT /api/tasks/:id/checklist
// @access  Private
const updateTaskChecklist = async (req, res) => {
  try {
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
