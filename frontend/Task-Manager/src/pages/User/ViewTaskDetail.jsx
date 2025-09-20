import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Notifications / alerts
import Swal from "sweetalert2"; // SweetAlert2 for nice alerts

// Authentication hook
import { useUserAuth } from "../../hooks/useUserAuth";

// User context
import { UserContext } from "../../context/userContext";

import DashboardLayout from "../../components/layouts/DashboardLayout";

// Date handling (Moment with Jalaali support)
import moment from "moment-jalaali";
import "moment/locale/fa";
import AvatarGroup from "../../components/AvatarGroup";

import { LuSquareArrowUp } from "react-icons/lu";
import { toPersianDigits } from "../../utils/helper";

// Configure moment-jalaali for Persian with Persian digits
moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

const statusMapper = {
  Pending: "بدون شروع",
  "In Progress": "در حال پیشرفت",
  Completed: "تکمیل شده",
};

const priorityMapper = {
  Low: "پایین",
  Medium: "متوسط",
  High: "بالا",
};

const ViewTaskDetail = () => {
  // Ensure user is authenticated (redirects if not)
  useUserAuth();
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-purple-50 text-purple-600 border-2 border-purple-400";
      case "In Progress":
        return "bg-cyan-50 text-cyan-600 border-2 border-cyan-400";
      case "Completed":
        return "bg-lime-50 text-lime-600 border-2 border-lime-400";
      default:
        return "bg-gray-50 text-gray-600 border-2 border-gray-400";
    }
  };

  const getTaskDetailById = useCallback(async () => {
    try {
      // Show loading modal
      Swal.fire({
        title: "در حال بارگذاری وظایف...",
        html: "لطفاً صبر کنید...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );

      if (response.data) {
        const taskInfo = response.data;
        setTask(taskInfo);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: "خطا در دریافت اطلاعات وظایف",
      });
      console.error("خطا هنگام دریافت اطلاعات وظیفه", err);
    } finally {
      // Always close loading modal
      Swal.close();
    }
  }, [id]);

  const updateTodoChecklist = async (index) => {
    const todoCheckList = [...(task?.todoCheckList || [])];
    const taskId = id;

    if (todoCheckList && todoCheckList[index]) {
      todoCheckList[index].completed = !todoCheckList[index].completed;

      try {
        const response = await axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
          {
            todoCheckList,
          }
        );
        if (response.status === 200) {
          setTask(response.data?.task || task);
        } else {
          todoCheckList[index].completed = !todoCheckList[index].completed;
        }
      } catch (err) {
        todoCheckList[index].completed = !todoCheckList[index].completed;
        console.error("خطا هنگام بروزرسانی لیست زیر وظایف", err);
      }
    }
  };

  const handleLineClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link;
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailById();
    }
  }, [getTaskDetailById, id]);

  return (
    <DashboardLayout activeMenu={`/user/tasks`}>
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center col-span-3 justify-between">
                <h2 className="text-xl md:text-xl font-medium">
                  {task?.title}
                </h2>
                <div
                  className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(
                    task?.status
                  )} px-4 py-0.5 rounded`}
                >
                  {statusMapper[task?.status] || task?.status}
                </div>
              </div>
              <div className="mt-4">
                <InfoBox
                  label="توضیحات"
                  value={statusMapper[task?.description] || task?.description}
                />
              </div>
              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="الویت"
                    value={priorityMapper[task?.priority] || task?.priority}
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="تاریخ سر رسید"
                    value={
                      moment(task?.dueDate)
                        .local("fa")
                        .format("jD jMMMM jYYYY") || "بدون تاریخ"
                    }
                  />
                </div>
                <div className="col-span-full justify-between md:justify-normal md:col-span-4 flex gap-3 flex-row md:flex-row w-full">
                  <label className="text-sm font-medium text-slate-500">
                    واگذاری شده به
                  </label>
                  <AvatarGroup
                    avatars={
                      task?.assignedTo?.map((item) => [
                        item.profileImageUrl,
                        item.name,
                      ]) || []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>
              <div className="mt-6 md:mt-4">
                <label className="text-sm font-medium text-slate-500">
                  لیست زیر وظایف
                </label>
                {task?.todoCheckList?.map((item, index) => (
                  <TodoCheckList
                    key={`todoCheckList ${index}`}
                    text={item.text}
                    isChecked={item?.completed}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>
              {task?.attachments?.length > 0 && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-slate-500">
                    لینک های ضمیمه
                  </label>

                  {task?.attachments?.map((link, index) => (
                    <Attachment
                      key={`link ${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLineClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const InfoBox = ({ label, value }) => {
  return (
    <>
      <label className="text-sm font-medium text-slate-500">{label}</label>
      <p className="text-[15px] md:text-[15px] font-medium text-gray-700 mt-0.5">
        {value}
      </p>
    </>
  );
};

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <label className="flex items-center gap-2 p-2 cursor-pointer select-none hover:bg-gray-100 rounded-md transition mt-0.5 justify-between">
      <span
        className={`text-sm ${
          isChecked ? "line-through text-gray-500" : "text-gray-800"
        }`}
      >
        {text}
      </span>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-primary border-gray-400 rounded-sm focus:ring-primary"
      />
    </label>
  );
};

const Attachment = ({ link, index, onClick }) => {
  return (
    <div
      className="flex justify-between bg-gray-100 border border-gray-200 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-1 flex items-center gap-3">
        <span className="text-sm text-gray-500 font-semibold ml-2">
          {toPersianDigits(index + 1)}
        </span>
        <p className="text-sm text-black underline hover:text-primary">
          {link}
        </p>
      </div>
      <LuSquareArrowUp className="text-gray-500" />
    </div>
  );
};

export default ViewTaskDetail;
