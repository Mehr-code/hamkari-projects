import React, { useContext, useEffect, useState } from "react";
import { SIDE__MENU_USER_DATA, SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

function SideMenu({ activeMenu }) {
  // Access user data and logout function from UserContext
  const { user, clearUser } = useContext(UserContext);

  // State to store menu items based on user role
  const [sideMenuData, setSideMenuData] = useState([]);

  // React Router navigate function
  const navigate = useNavigate();

  // Handle click on menu items
  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout(); // Call logout if route is 'logout'
      return;
    }
    navigate(route); // Navigate to the selected route
  };

  // Logout function: clears localStorage, resets user, and navigates to login
  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  // Update menu items whenever the user object changes
  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE__MENU_USER_DATA
      );
    }
  }, [user]);

  return (
    // Sidebar container: sticky to stay under Navbar, fixed width and height
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-l border-gray-200/50 sticky top-[61px] z-40">
      {/* User info section */}
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div>
          {/* Profile image with fallback if missing */}
          <img
            src={
              user?.profileImageUrl ||
              "http://localhost:8000/uploads/avatar.png"
            }
            alt="profile image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        </div>

        {/* Admin badge displayed only if user is admin */}
        {user?.role === "admin" && (
          <div className="text-[12px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            مدیر
          </div>
        )}

        {/* User name */}
        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>

        {/* User email */}
        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {/* Menu items */}
      {sideMenuData.map((item, i) => (
        <button
          key={`menu_${i}`} // unique key for each menu item
          onClick={() => handleClick(item.path)} // handle navigation
          className={`w-full flex items-center gap-4 text-[15px] ${
            // Highlight active menu item with gradient and border
            activeMenu?.toLowerCase().trim() === item.label.toLowerCase().trim()
              ? "text-primary bg-gradient-to-l from-blue-50/40 to-blue-100/50 border-l-[3px]"
              : ""
          } py-3 px-6 mb-3 cursor-pointer`}
        >
          {/* Icon for each menu item */}
          <item.icon className="text-xl" />
          {/* Menu label */}
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default SideMenu;
