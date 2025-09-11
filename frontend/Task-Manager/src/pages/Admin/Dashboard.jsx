import React, { useContext, useEffect, useState } from "react";
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
import { addThousandsSeparator } from "../../utils/helper";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure moment-jalaali for Persian with Persian digits
  moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
  const today = moment().format("dddd، jD jMMMM jYYYY");
  // Example output: سه‌شنبه، ۲۰ شهریور ۱۴۰۴

  /**
   * Fetch dashboard data from API
   * Shows SweetAlert2 loading while fetching
   * Handles errors with Swal alerts
   */
  const getDashboardData = async () => {
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
  };

  // Fetch dashboard data when user is available
  useEffect(() => {
    if (user) {
      getDashboardData();
    }
  }, [user]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* Display error if exists */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display dashboard content if data is loaded */}
      {dashboardData && (
        <div className="card my-5">
          {/* Header with user greeting and current date */}
          <div>
            <div className="col-span-3">
              <h2 className="text-xl md:text-2xl">وقتتون بخیر {user?.name}</h2>
              <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
                تاریخ امروز: {today}
              </p>
            </div>
          </div>

          {/* Info cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
            <InfoCard
              label="همه ی وظایف"
              value={addThousandsSeparator(
                dashboardData?.charts?.task?.All || 0
              )}
              color="bg-primary"
            />
            {/* Add more InfoCard components for other stats if needed */}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashBoard;
