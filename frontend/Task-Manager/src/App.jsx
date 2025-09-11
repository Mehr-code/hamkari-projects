import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

import PrivateRoute from "./routes/PrivateRoute";

import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTasks";
import ManageUsers from "./pages/Admin/ManageUsers"; // ✅ fixed typo in import path

import UserDashBoard from "./pages/User/UserDashBoard";
import UserTasks from "./pages/User/UserTasks";
import ViewTaskDetail from "./pages/User/ViewTaskDetail";

import { UserContext } from "./context/userContext";
import UserProvider from "./context/userProvider";
import React, { useContext } from "react";

const App = () => {
  return (
    // Wrap the entire app with UserProvider so context is available everywhere
    <UserProvider>
      <Router>
        <Routes>
          {/* Public authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected admin routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
          </Route>

          {/* Protected user routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDashBoard />} />
            <Route path="/user/tasks" element={<UserTasks />} />
            <Route
              path="/user/tasks-details/:id"
              element={<ViewTaskDetail />}
            />
          </Route>

          {/* Default root route */}
          <Route path="/" element={<Root />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

// Root component handles redirection based on authentication & role
const Root = () => {
  const { user, loading } = useContext(UserContext);

  // Show loading state while fetching user
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  // If no user, redirect to login
  if (!user) return <Navigate to="/login" />;

  // Redirect based on role
  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};

export default App;
