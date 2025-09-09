import React, { useContext } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const DashBoard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  return (
    <DashboardLayout>
      داشبورد ادمین
      {JSON.stringify(user)}
    </DashboardLayout>
  );
};

export default DashBoard;
