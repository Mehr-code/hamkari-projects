import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

// DashboardLayout component receives children and activeMenu as props
function DashboardLayout({ children, activeMenu }) {
  const { user } = useContext(UserContext);
  return (
    <div className="">
      {/* Render Navbar and pass activeMenu prop */}
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          <div className="hidden lg:block">
            {/* Render side menu */}
            <SideMenu activeMenu={activeMenu} />
          </div>
          {/* Render the main content */}
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
