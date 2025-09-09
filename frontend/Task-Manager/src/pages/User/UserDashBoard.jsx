import React from "react";
import { useUserAuth } from "../../hooks/useUserAuth";

const UserDashBoard = () => {
  useUserAuth();
  return <div>داشبورد کاربر عادی</div>;
};

export default UserDashBoard;
