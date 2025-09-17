import React, { useCallback, useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Notifications / alerts
import Swal from "sweetalert2"; // SweetAlert2 for nice alerts

// Authentication hook
import { useUserAuth } from "../../hooks/useUserAuth";

// User context
import { UserContext } from "../../context/userContext";
import { LuFileSpreadsheet } from "react-icons/lu";

import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";

// Dummy function for downloading report (not implemented yet)
const handleDownloadReport = () => {};

const ManageTasks = () => {
  // Ensure user is authenticated (redirects if not)
  useUserAuth();
  const { user } = useContext(UserContext);

  // State variables
  const [allTasks, setAllTasks] = useState([]); // stores all fetched tasks
  const [tabs, setTabs] = useState([]); // stores status counts for tabs
  const [filterStatus, setFilterStatus] = useState("All"); // active tab (status filter)
  const navigate = useNavigate();

  // Fetch all tasks from API
  const getAllTasks = useCallback(async () => {
    try {
      // Show loading modal
      Swal.fire({
        title: "در حال بارگذاری وظایف...",
        html: "لطفاً صبر کنید...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // API call with status filter
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      // Update tasks
      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      // Build tab status summary
      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];
      setTabs(statusArray);
    } catch (err) {
      // Error handling
      console.error("خطا در دریافت اطلاعات وظایف", err);
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: "خطا در دریافت اطلاعات وظایف",
      });
    } finally {
      // Always close loading modal
      Swal.close();
    }
  }, [filterStatus]);

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  // Fetch tasks whenever user is available or filter changes
  useEffect(() => {
    if (user) {
      getAllTasks();
    }
  }, [user, getAllTasks]);

  return (
    <DashboardLayout activeMenu="/admin/tasks">
      <div className="my-5">
        {/* Page header: contains title, mobile download button, and task status tabs with desktop download button */}
        <div className="flex flex-col lg:flex-col lg:items-start justify-between">
          {/* Title and download button (mobile only) */}
          <div className="flex items-center justify-between gap-3 lg:mb-0 mb-8">
            <h2 className="text-xl md:text-xl font-medium">وظایف من</h2>
            <button
              className="flex lg:hidden download-btn"
              onClick={handleDownloadReport}
            >
              دریافت PDF گزارش
              <LuFileSpreadsheet />
            </button>
          </div>

          {/* Tabs and desktop download button */}
          {tabs?.[0]?.count > 0 && (
            <div className="flex w-full justify-between items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
              <button
                className="hidden lg:flex download-btn"
                onClick={handleDownloadReport}
              >
                دریافت PDF گزارش
                <LuFileSpreadsheet className="text-lg" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks.map((item, id) => (
            <TaskCard
              key={`TaskCard ${id}`}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo?.map((person) => [
                person.profileImageUrl,
                person.name,
              ])}
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoCheckList.length || 0}
              onClick={() => handleClick(item)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
