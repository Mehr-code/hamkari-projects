import React, { useState, useContext } from "react";
import SideMenu from "./SideMenu";
import { HiOutlineX, HiOutlineMenu } from "react-icons/hi";
import { UserContext } from "../../context/userContext";

function Navbar({ activeMenu }) {
  // State to track whether mobile side menu is open
  const [openSideMenu, setOpenSideMenu] = useState(false);

  // Get current user from context
  const { user } = useContext(UserContext);

  return (
    // Navbar container: flex layout, sticky to top, blurred background with border
    <div className="flex items-center gap-5 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 py-4 px-7 sticky top-0 z-30 h-16">
      {/* Mobile toggle button for side menu */}
      <button
        className="block lg:hidden text-black"
        onClick={() => setOpenSideMenu((prev) => !prev)}
      >
        {/* Show close icon if menu is open, otherwise menu icon */}
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      {/* Navbar title */}
      <h2 className="text-lg font-semibold text-black">
        مدیریت وظایف پروژه ها
      </h2>

      {/* SideMenu for mobile, slides in from right */}
      {user && (
        <div
          className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:hidden ${
            openSideMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* SideMenu component receives activeMenu prop */}
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
}

export default Navbar;
