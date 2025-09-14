import React, { useContext, useEffect, useState, useCallback } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // Custom Axios instance
import { API_PATHS } from "../../utils/apiPaths"; // API endpoint paths
import Swal from "sweetalert2"; // SweetAlert2 for nice alerts
import moment from "moment-jalaali"; // Moment.js with Jalaali calendar
import "moment/locale/fa"; // Set Persian locale
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator, toPersianDigits } from "../../utils/helper";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomeBarChart from "../../components/Charts/CustomeBarChart";

const DashBoard = () => {
  // Ensure user is authenticated
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // State for dashboard data and charts
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // State for loading and error handling
  const [_, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure moment-jalaali for Persian with Persian digits
  moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
  const today = moment().format("dddd، jD jMMMM jYYYY");
  // Example output: سه‌شنبه، ۲۰ شهریور ۱۴۰۴

  /**
   * Prepares and formats chart data for visualization.
   *
   * - Converts raw API data into two datasets:
   *   1. Task distribution by status (Pending, In Progress, Completed) → Pie chart
   *   2. Task distribution by priority (Low, Medium, High) → Bar chart
   *
   * - Ensures missing values default to 0 to avoid chart rendering errors.
   * - Updates state with formatted datasets for chart components.
   *
   * @param {Object} data - Raw stats data from backend
   */
  const prepareChartData = (data) => {
    const taskDistriution = data?.taskDistriution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistriutionData = [
      { status: "Pending", count: taskDistriution?.Pending || 0 },
      { status: "In Progress", count: taskDistriution?.InProgress || 0 },
      { status: "Completed", count: taskDistriution?.Completed || 0 },
    ];

    setPieChartData(taskDistriutionData);

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(priorityLevelData);
  };

  /**
   * Fetch dashboard data from API
   * Shows SweetAlert2 loading while fetching
   * Handles errors with Swal alerts
   */
  const getDashboardData = useCallback(async () => {
    try {
      Swal.fire({
        title: "در حال بارگذاری پیشخوان...",
        html: "لطفاً صبر کنید...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );

      if (response?.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
        console.log("Dashboard data:", response.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("خطا هنگام دریافت اطلاعات پیشخوان. لطفا دوباره تلاش کنید.");

      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: "بارگذاری داشبورد موفق نبود.",
      });
    } finally {
      setLoading(false);
      Swal.close();
    }
  }, []);

  // Fetch dashboard data when user is available
  useEffect(() => {
    if (user) {
      getDashboardData();
    }
  }, [user, getDashboardData]);

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  return (
    <DashboardLayout activeMenu="/admin/dashboard">
      {/* Display error if exists */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display dashboard content if data is loaded */}
      {dashboardData && (
        <>
          <div className="card my-5">
            {/* Header with user greeting and current date */}
            <div>
              <div className="col-span-3">
                <h2 className="text-xl md:text-2xl">
                  وقتتون بخیر {user?.name}
                </h2>
                <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
                  تاریخ امروز: {today}
                </p>
              </div>
            </div>

            {/* Info cards grid */}
            <div className=" grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
              <InfoCard
                label="همه ی وظایف"
                value={toPersianDigits(
                  addThousandsSeparator(
                    dashboardData?.charts?.taskDistriution?.All || 0
                  )
                )}
                color="bg-primary"
              />
              <InfoCard
                label="وظایف بدون شروع"
                value={toPersianDigits(
                  addThousandsSeparator(
                    dashboardData?.charts?.taskDistriution?.Pending || 0
                  )
                )}
                color="bg-violet-500"
              />{" "}
              <InfoCard
                label="وظایف در حال پیشرفت"
                value={toPersianDigits(
                  addThousandsSeparator(
                    dashboardData?.charts?.taskDistriution?.InProgress || 0
                  )
                )}
                color="bg-cyan-500"
              />
              <InfoCard
                label="وظایف تکمیل شده"
                value={toPersianDigits(
                  addThousandsSeparator(
                    dashboardData?.charts?.taskDistriution?.Completed || 0
                  )
                )}
                color="bg-lime-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
            {/*
            Pie chart section displaying task distribution by status:
            - Pending: بدون شروع
            - In Progress: در حال پیشرفت
            - Completed: تکمیل شده
            Uses the CustomPieChart component with data from the pieChartData state.
            */}
            <div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">توزیع نموداری وضعیت وظایف </h5>
                </div>
                <CustomPieChart data={pieChartData} label="تراز کل" />
              </div>
            </div>

            <div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">توزیع نموداری الویت وظایف </h5>
                </div>
                <CustomeBarChart data={barChartData} />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between">
                  <h5 className="text-lg">آخرین وظایف</h5>
                  <button className="card-btn" onClick={onSeeMore}>
                    دیدن تمام وظایف <LuArrowLeft className="text-base" />
                  </button>
                </div>
                <TaskListTable tableData={dashboardData?.recentTasks || []} />
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DashBoard;
