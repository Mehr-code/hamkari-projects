// React core
import React, { useCallback, useEffect, useState } from "react";

// Layouts
import DashboardLayout from "../../components/layouts/DashboardLayout";

// Data and constants
import { PRIORITY_DATA } from "../../utils/data";
import { API_PATHS } from "../../utils/apiPaths";

// HTTP client
import axiosInstance from "../../utils/axiosInstance";

// Notifications
import toast from "react-hot-toast";

// Routing
import { useLocation, useNavigate } from "react-router-dom";

// Date handling
import moment from "moment-jalaali"; // Moment.js with Jalaali calendar support
import "moment/locale/fa"; // Persian locale for Moment.js
moment.loadPersian({ dialect: "persian-modern" });

// Icons
import { LuTrash2, LuCalendar } from "react-icons/lu";

// Form inputs
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAtachttmentsInput";

// Date picker
import DatePicker, { Calendar, DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"; // Persian calendar
import persian_fa from "react-date-object/locales/persian_fa"; // Persian locale for the date picker

import { convertFaMiladiToJalali } from "../../utils/helper";

// Notifications / alerts
import Swal from "sweetalert2"; // SweetAlert2 for nice alerts

function toEnglishDigits(str) {
  return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}

function jalaliToGregorian(jalaliDate) {
  // اول مطمئن شو اعداد انگلیسی هستند
  const normalized = toEnglishDigits(String(jalaliDate));
  return moment(normalized, "jYYYY/jMM/jDD").format("YYYY-MM-DD");
}

const CreateTasks = () => {
  const location = useLocation();
  const { taskId } = location.state || {}; // Extract taskId if editing an existing task
  const navigate = useNavigate();

  // State for storing new/existing task data
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  // State for the current loaded task (used in edit mode)
  const [currentTask, setCurrentTask] = useState(null);

  // Error handling state
  const [error, setError] = useState("");

  // Loading state for async operations
  const [loading, setLoading] = useState(false);

  // Delete confirmation modal state
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  // Update specific field of taskData
  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  // Reset all task data to default values
  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  // API call to create a new task
  const createTask = async () => {
    setLoading(true);

    try {
      const todoList = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      let gregorianDate = null;
      if (taskData.dueDate) {
        const jalaliStr =
          typeof taskData.dueDate === "string"
            ? taskData.dueDate
            : taskData.dueDate.format("jYYYY/jMM/jDD");

        gregorianDate = jalaliToGregorian(jalaliStr);
      }

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: gregorianDate,
        todoCheckList: todoList,
      });

      toast.success("وظیفه مورد نظر با موفقیت ایجاد شد.");
      clearData();
    } catch (err) {
      console.error("خطا هنگام ایجاد وظیفه", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // API call to update an existing task
  const updateTask = async () => {};

  // API call to delete an existing task
  const DeleteTask = async () => {};

  // Form submit handler
  const handleSubmit = async () => {
    setError(null);

    // Validate task title
    if (!taskData.title.trim()) {
      setError("عنوان تسک وارد نشده.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    // Validate task description
    if (!taskData.description.trim()) {
      setError("هیچ توضیحاتی وارد نشده.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    // Validate due date
    if (!taskData.dueDate) {
      setError("تاریخ سررسید انتخاب نشده.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    // Validate assigned users
    if (!taskData.assignedTo || taskData.assignedTo.length === 0) {
      setError("وظیفه به کسی واگذار نشده.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    // Validate todo checklist
    if (!taskData.todoChecklist || taskData.todoChecklist.length === 0) {
      setError("حداقل وارد کردن یک ریز وظیفه الزامی است.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    // If taskId exists → update task
    if (taskId) {
      updateTask();
      return;
    }

    // If priority is not set → set default value
    if (!taskData?.priority) {
      handleValueChange("priority", "Low");
    }

    // Create a new task
    createTask();
  };

  // Fetch task details by ID (when editing)
  const getTaskDetailsById = useCallback(async () => {
    try {
      // Show loading modal
      Swal.fire({
        title: "در حال بارگذاری وطیفه مورد نظر...",
        html: "لطفاً صبر کنید...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData((prevState) => ({
          ...prevState,
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? new DateObject({
                date: convertFaMiladiToJalali(taskInfo.dueDate),
                calendar: persian,
                locale: persian_fa,
              })
            : null,
          assignedTo: taskInfo.assignedTo?.map((member) => member?._id) || null,
          todoChecklist:
            taskInfo.todoChecklist?.map((task) => task?.text) || null,
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch (err) {
      console.error("خطا در دریافت اطلاعات وظیفه خواسته شده", err);
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: "خطا در دریافت اطلاعات وظیفه مورد نظر",
      });
    } finally {
      // Always close loading modal
      Swal.close();
    }
  }, [taskId]);

  const deleteTask = async () => {};

  useEffect(() => {
    if (taskId) {
      getTaskDetailsById();
    }
  }, [getTaskDetailsById, taskId]);

  return (
    <DashboardLayout activeMenu="/admin/create-task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              {/* Page title changes dynamically depending on whether editing or creating a task */}
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "ویرایش وظیفه" : "ایجاد وظیفه"}
              </h2>

              {/* Delete button is only visible when editing an existing task */}
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  حذف
                  <LuTrash2 className="text-base" />
                </button>
              )}
            </div>
            {/* Input field for the task title */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                عنوان
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="کشیدن DFD..."
                value={taskData.title}
                onChange={(e) => handleValueChange("title", e.target.value)}
              />
            </div>
            {/* Textarea for task description */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                توضیحات
              </label>
              <textarea
                placeholder="جزییات وظیفه..."
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={(e) =>
                  handleValueChange("description", e.target.value)
                }
              ></textarea>
            </div>
            {/* Grid layout for task settings like priority, due date, and assigned users */}
            <div className="grid grid-cols-12 gap-4 mt-2">
              {/* Priority dropdown */}
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  الویت
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(val) => handleValueChange("priority", val)}
                  placeholder="میزان الویت"
                />
              </div>

              {/* Due date picker */}
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  تاریخ سررسید
                </label>
                <div className="relative  ">
                  <DatePicker
                    value={taskData.dueDate}
                    onChange={(date) => handleValueChange("dueDate", date)}
                    calendar={persian} // Use Persian calendar
                    locale={persian_fa} // Persian locale
                    inputClass="date-input"
                    format="YYYY/MM/DD"
                    placeholder="انتخاب تاریخ"
                  />
                  {/* Calendar icon positioned inside the input */}
                  <LuCalendar
                    className="absolute right-[140px] md:right-[145px] top-1/2 -translate-y-1/2 
                   text-primary w-4 h-5 
                   bg-gray-100 rounded-sm"
                  />
                </div>
              </div>

              {/* User assignment component */}
              <div className="col-span-12 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  واگذاری به
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => {
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>
            {/* TODO Checklist */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                لیست ریز وظیفه ها
              </label>
              <TodoListInput
                todoList={taskData?.todoChecklist || []}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>
            {/* Attachment Files */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                اضافه کردن فایل های ضمیمه
              </label>
              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachment={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-600 font-semibold text-sm mt-5 animate-shake">
                {error}
              </p>
            )}

            {/*Submit button centered at the bottom */}
            <div className="col-span-12 flex justify-center items-center mt-7">
              <button className="add-btn" onClick={handleSubmit}>
                {taskId ? "ثبت تغییرات" : "ایجاد وظیفه"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTasks;
