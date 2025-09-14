import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-jalaali"; // Moment.js with Jalaali calendar support
import "moment/locale/fa"; // Persian locale for Moment.js
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";

import DatePicker, { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { LuCalendar } from "react-icons/lu";

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
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  // API call to create a new task
  const createTask = async () => {};

  // API call to update an existing task
  const updateTask = async () => {};

  // API call to delete an existing task
  const DeleteTask = async () => {};

  // Form submit handler
  const handleSubmit = async () => {};

  // Fetch task details by ID (when editing)
  const getTaskDetailsById = async () => {};

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
                  <LuTrash2 className="text-base" />
                  حذف
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
                placeholder="کشیدن DFD"
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
                placeholder="جزییات وظیفه"
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
                  placeholder="انتخاب کنید"
                />
              </div>

              {/* Due date picker */}
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  تاریخ سررسید
                </label>
                <div className="relative">
                  <DatePicker
                    value={taskData.dueDate}
                    onChange={(date) =>
                      handleValueChange("dueDate", date.format())
                    }
                    calendar={persian} // Use Persian calendar
                    locale={persian_fa} // Persian locale
                    inputClass="form-input w-full pl-10 cursor-pointer"
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
              <div className="col-span-12 md:col-span-3">
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

            {/* Submit button centered at the bottom */}
            <div className="col-span-12 flex justify-center items-center mt-4">
              <button className="card-btn-fill">ثبت</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTasks;
