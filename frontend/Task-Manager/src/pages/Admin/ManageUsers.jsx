import React, { useCallback, useEffect, useState, useContext } from "react";

// Layouts & Components
import DashboardLayout from "../../components/layouts/DashboardLayout";
import UserCard from "../../components/Cards/UserCard";

// Utils
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Icons
import { LuFileSpreadsheet } from "react-icons/lu";

// Notifications / alerts
import Swal from "sweetalert2"; // SweetAlert2 for modern alerts

// Context
import { UserContext } from "../../context/userContext";

// Notifications
import toast from "react-hot-toast";

const ManageUsers = () => {
  // Get current user from context
  const { user } = useContext(UserContext);

  // State: store all users fetched from backend
  const [allUsers, setAllUsers] = useState([]);

  // Fetch all users from API
  const getAllUsers = useCallback(async () => {
    try {
      // Show loading modal while fetching
      Swal.fire({
        title: "در حال دریافت اطلاعات کاربران",
        html: "لطفاً صبر کنید...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // API call
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

      // Update state if users exist
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (err) {
      // Error notification
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: "خطا هنگام دریافت اطلاعات کاربران",
      });
      console.error("Error fetching users:", err);
    } finally {
      // Close loading modal
      Swal.close();
    }
  }, []);

  // TODO: Implement download report feature
  const handleDownloadReport = async () => {
    try {
      // 1. Send request to backend to fetch the Excel file (as a binary blob)
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      // 2. Create a temporary URL object for the blob data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // 3. Create a hidden <a> element to trigger file download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "گزارش تیم.xlsx"); // Filename for the download

      // 4. Append link to DOM and simulate a click
      document.body.appendChild(link);
      link.click();

      // 5. Remove the temporary link element
      link.parentNode.removeChild(link);

      // 6. Revoke the blob URL to free memory
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // 7. Handle errors (log + user-friendly toast message)
      console.error("خطا هنگام دانلود گزارش تیم", err);
      toast.error(
        "عملیات دانلود گزارش تیم ناموفق بود. یک بار دیگر امتحان کنید."
      );
    }
  };

  // On component mount (or when `user` changes), fetch users
  useEffect(() => {
    if (user) {
      getAllUsers();
    }
  }, [user, getAllUsers]);

  return (
    <DashboardLayout activeMenu="/admin/manage-users">
      <div className="mt-5 mb-10">
        {/* Header: title + download button */}
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">اعضای تیم</h2>
          <button
            className="flex md:flex download-btn"
            onClick={handleDownloadReport}
          >
            دریافت گزارش تیم
            <LuFileSpreadsheet />
          </button>
        </div>

        {/* Users grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {allUsers.map((user) => (
            <UserCard key={`User ${user._id}`} userInfo={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
